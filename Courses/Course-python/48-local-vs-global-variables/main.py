x = 10 # global variable

def my_function():
  y = 5 # local variable
  print(y)

my_function()
print(x)
print(y) # this will cause an error because y is a local variable and is not accessible outside of the function