def speed(speed, reverse):
	 a = (1023 * (speed * 10)) / 100
	 if (reverse == True):
		 a = a + 1024
	 return a;

print(speed(10, False))
	
