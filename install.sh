#!/bin/bash

# SARTRobot installer
# Handles installing the SART service and related software
# 
# Created by the Semi-Autonomous Rescue Team
# This file is part of the SART project
#
# https://www.sfxrescue.com
# https://www.github.com/SFXRescue


INSTALL_DIR=/opt/sart
INSTALL_USER=sart

install_dependencies () {
    echo -e "\nInstalling dependencies..."
    apt update
    apt install -y git apache2 python3 python3-pip wget
    echo
}

install_sart_repositories () {
    echo -e "\nDownloading SART repositories..."

    # Get SARTRobot
    git clone https://github.com/SFXRescue/SARTRobot

    # Get SARTInterface
    git clone https://github.com/SFXRescue/SARTInterface

    # Install all Python packages required by SARTRobot
    echo -e "\nInstalling required Python packages..."
    python3 -m pip install -r SARTRobot/requirements.txt
    echo
}

install_apache () {
    echo -e "\nSetting up Apache..."

    # This is the site file that defines where the interface is hosted from
    # It also sets up a reverse proxy for Supervisor to work correctly
    echo -e "\nCopying SARTInterface site config..."
    cp SARTRobot/configs/apache/SARTInterface.conf /etc/apache2/sites-available/

    # This is the required option to allow Apache to host from $INSTALL_DIR
    echo -e "\nAllowing Apache to host the SARTInterface directory..."
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

    echo -e "\nDisabling Apache default site and enabling SARTInterface..."
    a2dissite 000-default.conf
    a2ensite SARTInterface.conf

    echo -e "\nEnabling Apache proxy modules..."
    a2enmod proxy
    a2enmod proxy_http

    echo -e "\nStarting Apache..."
    service apache2 restart
    service apache2 start
    echo
}

install_motion () {
    # Attempt to get the correct file by codename
    # Tested and working on Debian and Ubuntu
    echo -e "\nDownloading Motion..."
    wget https://github.com/Motion-Project/motion/releases/download/release-4.2.2/${DETECTED_CODENAME}_motion_4.2.2-1_amd64.deb

    echo -e "\nInstalling Motion..."
    apt install -y ./${DETECTED_CODENAME}_motion_4.2.2-1_amd64.deb
    rm ${DETECTED_CODENAME}_motion_4.2.2-1_amd64.deb

    echo -e "\nCopying Motion configuration file to /etc/motion..."
    cp SARTRobot/configs/motion/motion.conf /etc/motion/

    echo -e "\nEnabling Motion daemon flag..."
    echo "# set to 'yes' to enable the motion daemon
    start_motion_daemon=yes" > /etc/default/motion

    echo -e "\nEnabling Motion service..."
    systemctl enable motion
    echo
}

install_shellinabox () {
    echo -e "\nInstalling ShellInABox..."
    apt update
    apt install -y shellinabox

    echo -e "\nDisabling SSL..."
    sed -i 's/SHELLINABOX_ARGS=.*/SHELLINABOX_ARGS="--no-beep --disable-ssl"/' /etc/default/shellinabox

    echo -e "\nStarting shellinabox service..."
    service shellinabox start
    echo
}

install_supervisor () {
    # Supervisor
    echo -e "\nInstalling Supervisor..."
    python3 -m pip install supervisor

    echo -e "\nCopying Supervisor configuration file..."
    cp SARTRobot/configs/supervisor/supervisord.conf /etc/

    echo -e "\nDownloading Supervisor SART extension..."
    git clone https://github.com/SFXRescue/supervisor_sart_config

    echo -e "\nInstalling Supervisor SART extension..."
    python3 -m pip install ./supervisor_sart_config

    echo -e "\nAdding supervisord to /etc/rc.local..."
    if grep -Fxq "supervisord &" /etc/rc.local
    then
        echo -e "Already done..."
    else
        sed -i -e '$i \supervisord &\n' /etc/rc.local
    fi
    echo
}

update () {
    echo -e "\nPerforming a basic update"
    apt update
    apt upgrade

    echo -e "\nUpdating SARTRobot"
    cd SARTRobot
    git pull
    cd ..

    echo -e "\nUpdating SARTInterface"
    cd SARTInterface
    git pull
    cd ..

    echo -e "\nCopying Motion configuration file..."
    cp SARTRobot/configs/motion/motion.conf /etc/motion/

    echo -e "\nCopying Supervisor configuration file..."
    cp SARTRobot/configs/supervisor/supervisord.conf /etc/

    echo -e "Update complete!"

    echo
}

complete_install () { 
    install_dependencies
    install_sart_repositories
    install_apache
    install_motion
    install_shellinabox
    install_supervisor
    echo -e "\nInstallation complete!"
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

    echo -e "Transfering ownership of directory to user: $INSTALL_USER"
    chown $INSTALL_USER:$INSTALL_USER $INSTALL_DIR
fi

# Go to directory
cd $INSTALL_DIR

# Print welcome message
echo -e "\nS.A.R.T. software installer"

DETECTED_OS=$(cat /etc/*-release | grep -E "\bID=" | sed 's/ID=//g')
DETECTED_CODENAME=$(cat /etc/*-release | grep "VERSION_CODENAME" | sed 's/VERSION_CODENAME=//g')

echo -e "\nDetected OS: $DETECTED_OS $DETECTED_CODENAME"
if [ $DETECTED_OS == "ubuntu" ] || [ $DETECTED_OS == "debian" ]
then
    echo -e "Using a supported OS"
else
    echo -e "Using an unsupported OS"
fi
echo

options=(
    "Complete Install" 
    "Install Dependencies" 
    "Install SART Software"
    "Setup Apache" 
    "Setup Motion" 
    "Setup ShellInABox" 
    "Setup Supervisor"
    "Update"
)
PS3="Enter a number (1-${#options[@]}) or q to quit: "

select option in "${options[@]}"; do
    case "$REPLY" in 
        1) complete_install ;;
        2) install_dependencies ;;
        3) install_sart_repositories ;;
        4) install_apache ;;
        5) install_motion ;;
        6) install_shellinabox ;;
        7) install_supervisor ;;
        8) update ;;
        q) exit ;;
    esac
done