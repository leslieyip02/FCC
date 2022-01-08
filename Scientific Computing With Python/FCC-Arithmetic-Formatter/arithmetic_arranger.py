import re

def arithmetic_arranger(problems, solve=False):
    # Handle too many problems
    if len(problems) > 5:
        return "Error: Too many problems."
    
    tempRow1 = []
    tempRow2 = []
    tempRow3 = []
    tempRow4 = []

    for problem in problems:
      
        input = problem.split(" ")
        print(input)

        if len(input) > 3:
            return "????"
        # Handle operator type
        validOperator = re.match("[\+\-]", input[1])
        if validOperator == None:
            return "Error: Operator must be '+' or '-'."
        # Handle number type
        def digitValidator(number):
            for digit in number:
                if re.match("\d", digit) == None:
                    return False;
        if digitValidator(input[0]) == False or digitValidator(input[2]) == False:
            return "Error: Numbers must only contain digits."
        # Handle number length
        if len(input[0]) > 4 or len(input[2]) > 4:
            return "Error: Numbers cannot be more than four digits."

        dashLength = max([len(input[0]), len(input[2])]) + 2

        # Handle 1st row
        row1Add = input[0]
        while len(row1Add) < dashLength:
            row1Add = " " + row1Add
        #print(row1Add)
        tempRow1.append(row1Add)

        # Handle 2nd row
        row2Add = input[2]
        while len(row2Add) < dashLength - 1:
            row2Add = " " + row2Add
        row2Add = input[1] + row2Add
        #print(row2Add)
        tempRow2.append(row2Add)

        # Handle 3rd row
        dashes = ""
        for i in range(dashLength):
            dashes = dashes + "-"
        #print(dashes)
        tempRow3.append(dashes)

        # Handle 4th row
        sum = None
        if input[1] == "+":
            sum = int(input[0]) + int(input[2])
        elif input[1] == "-":
            sum = int(input[0]) - int(input[2])
        sum = str(sum)
        while len(sum) < dashLength:
            sum = " " + sum
        #print(sum)
        tempRow4.append(sum)

    firstRow = "    ".join(tempRow1) + "\n"
    secondRow = "    ".join(tempRow2) + "\n"
    thirdRow = "    ".join(tempRow3)
    fourthRow = "\n" + "    ".join(tempRow4)

    arranged_problems = firstRow + secondRow + thirdRow
    if solve:
        arranged_problems = arranged_problems + fourthRow
    print(arranged_problems)
      
    return arranged_problems