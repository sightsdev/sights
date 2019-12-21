#!/bin/bash

# SIGHTS installer
# Handles installing SIGHTS
# 
# Created by the Semi-Autonomous Rescue Team
# This file is part of the SIGHTS project
#
# https://www.sfxrescue.com
# https://www.github.com/SFXRescue


INSTALL_DIR=/opt/sights
MOTION_VER=4.2.2

print_detected_ip () {
  output="Visit http://localhost$1 on the host machine"
  hostname=$(hostname -I)
  if [[ $hostname ]]
  then
    for ip in $hostname
    do
      output="$output or http://$ip$1"
    done
    output="$output on any decice on the local network."
  else
    output="$output or connect to a network."
  fi
  echo "$output"
  echo
}

enable_ssh () {
    echo -e "\nEnabling SSH..."
    systemctl enable ssh
    echo -e "\nStarting SSH..."
    systemctl start ssh
}

install_dependencies () {
    echo -e "Transfering ownership of directory to user: $SUDO_USER"
    chown $SUDO_USER:$SUDO_USER -R $INSTALL_DIR
    
    echo -e "\nInstalling dependencies..."
    apt update
    apt install -y git apache2 python3 python3-pip wget gdebi 
    echo
}

install_sights_repositories () {
    echo -e "\nDownloading SIGHTS repositories..."

    # Get SIGHTSRobot
    git clone https://github.com/SFXRescue/SIGHTSRobot

    # Get SIGHTSInterface
    git clone https://github.com/SFXRescue/SIGHTSInterface

    # Install all Python packages required by SIGHTSRobot
    echo -e "\nInstalling required Python packages..."
    python3 -m pip install -r SIGHTSRobot/src/requirements.txt
    echo
}

install_apache () {
    echo -e "\nSetting up Apache..."

    # This is the site file that defines where the interface is hosted from
    # It also sets up a reverse proxy for Supervisor to work correctly
    echo -e "\nCopying SIGHTSInterface site config..."
    cp SIGHTSRobot/src/configs/apache/SIGHTSInterface.conf /etc/apache2/sites-available/

    # This is the required option to allow Apache to host from $INSTALL_DIR
    echo -e "\nAllowing Apache to host the SIGHTSInterface directory..."
    # Only append this to the file if it does not already exist
    if grep -Fxq "<Directory ${INSTALL_DIR}/>" /etc/apache2/apache2.conf
    then
        echo -e "Already done..."
    else
        echo -e "<Directory ${INSTALL_DIR}/>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>" >> /etc/apache2/apache2.conf
    fi

    echo -e "\nDisabling Apache default site and enabling SIGHTSInterface..."
    a2dissite 000-default.conf
    a2ensite SIGHTSInterface.conf

    echo -e "\nEnabling Apache proxy modules..."
    a2enmod proxy
    a2enmod proxy_http

    echo -e "\nStarting Apache..."
    service apache2 restart
    service apache2 start
    service apache2 reload
    echo
    print_detected_ip "/"
}

install_motion () {
    # Only install prebuilt binaries which are available only on supported OSs
    if [ $DETECTED_OS == "ubuntu" ] || [ $DETECTED_OS == "debian" ] || [ $DETECTED_OS == "raspbian" ]
    then
        if [ $DETECTED_CODENAME == "bionic" ] || [ $DETECTED_CODENAME == "cosmic" ] || [ $DETECTED_CODENAME == "buster" ]
        then
            echo -e "\nDownloading Motion..."
            
            if [ $DETECTED_OS == "raspbian" ]
            then 
                # Get the armhf binaries (with the pi prefix) for Raspbian
                wget https://github.com/Motion-Project/motion/releases/download/release-4.2.2/pi_${DETECTED_CODENAME}_motion_${MOTION_VER}-1_armhf.deb -O motion.deb
            else
                # For x86 systems, just use the normal amd64 binaries
                wget https://github.com/Motion-Project/motion/releases/download/release-4.2.2/${DETECTED_CODENAME}_motion_${MOTION_VER}-1_amd64.deb -O motion.deb
            fi

            echo -e "\nInstalling Motion..."
            gdebi -n ./motion.deb
            rm ./motion.deb

            echo -e "\nCreating symlink for Motion configuration files..."
            rm -r /etc/motion
            ln -s /opt/sights/SIGHTSRobot/src/configs/motion /etc

            echo -e "\nEnabling Motion daemon flag..."
            echo "start_motion_daemon=yes" > /etc/default/motion

            echo -e "\nEnabling Motion service..."
            systemctl enable motion

            echo -e "\nStarting Motion service..."
            service motion start
            service motion restart
        else
            echo -e "\n Unsupported release"
        fi
    else
        echo -e "\n Unsupported distribution"
    fi
    echo
    print_detected_ip ":8080/"
}

install_shellinabox () {
    echo -e "\nInstalling ShellInABox..."
    apt update
    apt install -y shellinabox

    echo -e "\nDisabling SSL..."
    sed -i 's/SHELLINABOX_ARGS=.*/SHELLINABOX_ARGS="--no-beep --disable-ssl"/' /etc/default/shellinabox

    if [ $DETECTED_OS == "raspbian" ]; then
        enable_ssh
    fi

    echo -e "\nStarting shellinabox service..."
    service shellinabox start
    echo
    print_detected_ip ":4200/"
}

install_supervisor () {
    # Supervisor
    echo -e "\nInstalling Supervisor..."
    python3 -m pip install supervisor

    echo -e "\nCreating symlink for Supervisor configuration files..."
    ln -sf /opt/sights/SIGHTSRobot/src/configs/supervisor /etc 

    echo -e "\nDownloading Supervisor SIGHTS extension..."
    git clone https://github.com/SFXRescue/supervisor_sights_config

    echo -e "\nInstalling Supervisor SIGHTS extension..."
    python3 -m pip install ./supervisor_sights_config

    echo -e "\nInstalling Supervisor init script"
    cp SIGHTSRobot/src/configs/systemd/supervisord /etc/init.d/
    chmod 755 /etc/init.d/supervisord
    chown root:root /etc/init.d/supervisord
    update-rc.d supervisord defaults

    echo -e "\nRunning Supervisor"
    /etc/init.d/supervisord start
    
    echo
    print_detected_ip ":9001/"
}

enable_i2c () {
    if [ $DETECTED_OS == "raspbian" ]
    then 
        echo -e '\nEnabling i2c-bcm2708 module...'
        if grep -q 'i2c-bcm2708' /etc/modules; then
            echo 'i2c-bcm2708 module already enabled.'
        else
            modprobe i2c-bcm2708
            echo 'i2c-bcm2708' >> /etc/modules
            echo -e '\nEnabled i2c-bcm2708 module.'
        fi

        echo -e '\nEnabling i2c-dev module...'
        if grep -q 'i2c-dev' /etc/modules; then
            echo -e 'i2c-dev module already enabled.'
        else
            modprobe i2c-dev
            echo 'i2c-dev' >> /etc/modules
            echo -e 'Enabled i2c-dev module.'
        fi

        echo -e '\nSetting i2c_arm parameter boot config option...'
        if grep -q 'dtparam=i2c_arm=on' /boot/config.txt; then
            echo -e 'i2c_arm parameter already set.'
        else
            echo 'dtparam=i2c_arm=on' >> /boot/config.txt
            echo -e '\nSet i2c_arm parameter boot config option...'
        fi

        echo -e '\nRemoving i2c from blacklists...'
        if [ -f /etc/modprobe.d/raspi-blacklist.conf ]; then
            sed -i 's/^blacklist spi-bcm2708/#blacklist spi-bcm2708/' /etc/modprobe.d/raspi-blacklist.conf
            sed -i 's/^blacklist i2c-bcm2708/#blacklist i2c-bcm2708/' /etc/modprobe.d/raspi-blacklist.conf
        else
            echo 'File raspi-blacklist.conf does not exist, skip this step.'
        fi
    else
        echo -e '\nThis option can only be used on a Raspberry Pi (running Raspbian).'
        echo -e '\nFor other devices or operating systems, consult the manufacturers documentation for enabling I2C.'
    fi

}

update () {
    #echo -e "\nPerforming a system update"
    #apt update
    #apt upgrade -y

    echo -e "\nUpdating SIGHTSRobot..."
    cd SIGHTSRobot
    git pull
    cd ..

    echo -e "\nUpdating SIGHTSInterface..."
    cd SIGHTSInterface
    git pull
    cd ..

    echo -e "\nUpdating Supervisor SIGHTS extension..."
    cd supervisor_sights_config
    git pull
    cd ..
    python3 -m pip install ./supervisor_sights_config

    echo -e "\nRestarting Supervisord and SIGHTS..."
    service supervisord restart
    #supervisord restart sights

    echo -e "\nUpdate complete!"
    echo
    print_detected_ip "/"
}

complete_install () { 
    install_dependencies
    install_sights_repositories
    install_apache
    install_motion
    install_shellinabox
    install_supervisor
    echo -e "\nInstallation complete! Reboot to ensure proper functionality."
    print_detected_ip "/"
}

# Ensure user is running as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Setup install directory
if [ ! -d "$INSTALL_DIR" ]; then
    echo -e "Creating installation directory at $INSTALL_DIR"
    mkdir $INSTALL_DIR
fi

# Go to directory
cd $INSTALL_DIR

# Print welcome message
echo -e "\nSIGHTS installer"

DETECTED_OS=$(cat /etc/*-release | grep -E "\bID=" | sed 's/ID=//g')
DETECTED_CODENAME=$(cat /etc/*-release | grep "VERSION_CODENAME" | sed 's/VERSION_CODENAME=//g')

echo -e "\nDetected OS: $DETECTED_OS $DETECTED_CODENAME"
if [ $DETECTED_OS == "ubuntu" ] || [ $DETECTED_OS == "debian" ]
then
    echo -e "Using a supported OS"
else
    echo -e "Using an unsupported OS"
fi
echo -e "Installing as $SUDO_USER"
echo

options=(
    "Complete Install" 
    "Install Dependencies" 
    "Install SIGHTS Software"
    "Setup Apache" 
    "Setup Motion" 
    "Setup ShellInABox" 
    "Setup Supervisor"
    "Enable I2C"
    "Update"
    "Detect IPs"
)
PS3="Enter a number (1-${#options[@]}) or q to quit: "

select option in "${options[@]}"; do
    case "$REPLY" in 
        1) complete_install ;;
        2) install_dependencies ;;
        3) install_sights_repositories ;;
        4) install_apache ;;
        5) install_motion ;;
        6) install_shellinabox ;;
        7) install_supervisor ;;
        8) enable_i2c ;;
        9) update ;;
        10) print_detected_ip "/" ;;
        q) exit ;;
    esac
done
