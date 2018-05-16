import pygame, time, math

AXIS_THRESHOLD = 8689 / 32767.0

pygame.joystick.init()

joystick = pygame.joystick.Joystick(0)
joystick.init()

print ('Initialised Joystick : %s' % joystick.get_name())

screen = pygame.display.set_mode((100,100))

numaxes = joystick.get_numaxes()
print("numaxes")
print(numaxes)

speed_factor = 512

def steering(x, y):
        y *= -1
        x *= -1

        if (x > -AXIS_THRESHOLD and x < AXIS_THRESHOLD):
                x = 0
        if (y > -AXIS_THRESHOLD and y < AXIS_THRESHOLD):
                y = 0

	# convert to polar
        r = math.hypot(y, x)
        t = math.atan2(x, y)

	# rotate by 45 degrees
        t += math.pi / 4

	# back to cartesian
        left = r * math.cos(t)
        right = r * math.sin(t)

	# rescale the new coords
        left = left * math.sqrt(2)
        right = right * math.sqrt(2)

	# clamp to -1/+1
        left = max(-1, min(left, 1))
        right = max(-1, min(right, 1))

        left *= speed_factor
        right *= speed_factor

        print("Left:", left)
        print("Right:", right)

loopQuit = False
while loopQuit == False:

        pygame.event.pump()
        x = joystick.get_axis(0)
        pygame.event.pump()
        y = joystick.get_axis(1)

        steering(x, y)

        for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                        if event.key == pygame.K_ESCAPE:
                                loopQuit = True

        pygame.display.update()
        time.sleep(0.1)

pygame.quit()
