import copy
import random
# Consider using the modules imported above.

class Hat:
    def __init__(self, **balls):
        self.contents = list()
        for k,v in balls.items():
            i = 0
            while i < v:
                self.contents.append(k)
                i = i + 1
    def draw(self, num):
        mock = copy.copy(self.contents)
        if num >= len(mock): return mock
        output = list()
        j = 0
        while j < num:
            output.append(mock.pop(random.randint(0, len(mock) - 1)))
            j = j + 1
        self.contents = mock
        return output

def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
    count = 0
    i = 0
    while i < num_experiments:
        mock = copy.copy(hat)
        di = dict()
        for ball in mock.draw(num_balls_drawn):
            di[ball] = di.get(ball, 0) + 1
        passed = True
        for k,v in expected_balls.items():
            if k not in di or v > di[k]:
                passed = False
        if passed: count = count + 1
        i = i + 1
    return round(count / num_experiments, 3) 