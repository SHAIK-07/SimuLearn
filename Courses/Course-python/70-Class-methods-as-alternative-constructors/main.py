class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @classmethod
    def from_string(cls, string):
        name, age = string.split(',')
        return cls(name, int(age))

class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

class Rectangle:
  def __init__(self, width, height):
    self.width = width
    self.height = height

  @classmethod
  def square(cls, size):
    return cls(size, size)

rectangle = Rectangle.square(10)