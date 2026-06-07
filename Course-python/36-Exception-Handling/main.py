try:
      #statements which could generate 
      #exception
except:
      #Soloution of generated exception

try:
    num = int(input("Enter an integer: "))
except ValueError:
    print("Number entered is not an integer.")