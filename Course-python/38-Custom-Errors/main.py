salary = int(input("Enter salary amount: "))
if not 2000 < salary < 5000:
    raise ValueError("Not a valid salary")

class CustomError(Exception):
  # code ...
  pass

try:
  # code ...

except CustomError:
  # code...