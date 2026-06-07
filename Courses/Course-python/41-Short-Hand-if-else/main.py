a = 2
b = 330
print("A") if a > b else print("B")

a = 330
b = 330
print("A") if a > b else print("=") if a == b else print("B")

result = value_if_true if condition else value_if_false

if condition:
    result = value_if_true
else:
    result = value_if_false