import math

class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    def set_width(self, width):
        self.width = width
    def set_height(self, height):
        self.height = height
    def get_area(self):
        return self.width * self.height
    def get_perimeter(self):
        return (self.width + self.height) * 2
    def get_diagonal(self):
        return (self.width ** 2 + self.height ** 2) ** 0.5
    def get_picture(self):
        if self.width > 50 or self.height > 50:
            return 'Too big for picture.'
        output = ''
        i = 0
        while i < self.height:
            j = 0
            while j < self.width:
                output = output + '*'
                j = j + 1
            output = output + '\n'
            i = i + 1
        return output
    def get_amount_inside(self, shape):
        w1 = shape.width
        h1 = shape.height
        if w1 > self.width or h1 > self.height:
            return 0
        maxW = math.floor(self.width / w1)
        maxH = math.floor(self.height / h1)
        return maxW * maxH
    def __str__(self):
        return f'Rectangle(width={self.width}, height={self.height})'

class Square(Rectangle):
    def __init__(self, side):
        self.width = side
        self.height = side
    def set_side(self, side):
        self.width = side
        self.height = side
    def set_width(self, side):
        self.set_side(side)
    def set_height(self, side):
        self.set_side(side)
    def __str__(self):
        return f'Square(side={self.width})'