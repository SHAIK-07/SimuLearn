# Loop over a list and print the index and value of each element
fruits = ['apple', 'banana', 'mango']
for index, fruit in enumerate(fruits):
    print(index, fruit)

0 apple
1 banana
2 mango

# Loop over a list and print the index (starting at 1) and value of each element
fruits = ['apple', 'banana', 'mango']
for index, fruit in enumerate(fruits, start=1):
    print(index, fruit)

1 apple
2 banana
3 mango

fruits = ['apple', 'banana', 'mango']
for index, fruit in enumerate(fruits):
    print(f'{index+1}: {fruit}')

1: apple
2: banana
3: mango

# Loop over a tuple and print the index and value of each element
colors = ('red', 'green', 'blue')
for index, color in enumerate(colors):
    print(index, color)

# Loop over a string and print the index and value of each character
s = 'hello'
for index, c in enumerate(s):
    print(index, c)