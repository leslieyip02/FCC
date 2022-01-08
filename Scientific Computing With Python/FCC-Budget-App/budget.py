import math

class Category:
    def __init__(self, name):
        self.name = name
        self.ledger = list()
    def deposit(self, amt, desc=''):
        self.ledger.append({ "amount": amt, "description": desc })
    def withdraw(self, amt, desc=''):
        if not self.check_funds(amt) or amt <= 0: return False
        self.ledger.append({ "amount": amt * -1, "description": desc })
        return True
    def get_balance(self):
        total = 0
        for entry in self.ledger:
            total = total + entry["amount"]
        return total
    def transfer(self, amt, destination):
        if not self.check_funds(amt) or amt <= 0: return False
        self.withdraw(amt, f'Transfer to {destination.name}')
        destination.deposit(amt, f'Transfer from {self.name}')
        return True
    def check_funds(self, amt):
        if amt > self.get_balance(): return False
        return True
    def __str__(self):
        l = math.floor((30 - len(self.name)) / 2)
        temp = "*" * 30
        lside = temp[0:l]
        rside = temp[l + len(self.name):]
        output = lside + self.name + rside + '\n'
        for entry in self.ledger:
            desc = entry["description"][:23]
            while len(desc) < 23:
                desc = desc + ' '
            amt = f'{entry["amount"]:.2f}'[:7]
            while len(amt) < 7:
                amt = ' ' + amt
            line = desc + amt + '\n'
            output = output + line
        total = f'Total: {self.get_balance()}'
        output = output + total
        return output
            
      
def create_spend_chart(categories):
    totalWithdrawn = 0
    for cat in categories:
        for entry in cat.ledger:
            if entry["amount"] < 0:
                totalWithdrawn = totalWithdrawn - entry["amount"]
    
    output = ''
    chart = ['  0| ', ' 10| ', ' 20| ', ' 30| ', ' 40| ', ' 50| ', ' 60| ', ' 70| ', ' 80| ', ' 90| ', '100| ']
    for cat in categories:
        withdrawn = 0
        for entry in cat.ledger:
            if entry["amount"] < 0:
                withdrawn = withdrawn - entry["amount"]
        h = math.floor((withdrawn / totalWithdrawn) * 10) + 1
        for i in range(h):
            chart[i] = chart[i] + 'o  '
        for i in range(11)[h:]:
            chart[i] = chart[i] + '   '
    chart.reverse()
    for row in chart:
        row = row + '\n'
        output = output + row

    output = 'Percentage spent by category\n' + output + '    -' + '---' * len(categories)

    labels = list()
    for cat in categories:
        while len(labels) < len(cat.name):
            labels.append('')
    for cat in categories:
        for j in range(len(labels)):
            if j < len(cat.name):
                labels[j] = labels[j] + cat.name[j] + '  '
            else:
                labels[j] = labels[j] + '   '

    for k in range(len(labels)):
        labels[k] = '\n     ' + labels[k]
        output = output + labels[k]
  
    print(output)
    return output