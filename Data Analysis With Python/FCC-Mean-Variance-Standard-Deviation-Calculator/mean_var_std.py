import numpy as np

def calculate(list):
    # handle invalid input
    if len(list) != 9:
        raise ValueError('List must contain nine numbers.')
  
    # convert input to np array
    arr = np.array(list)
    arr = arr.reshape(3, 3)
    print(arr)

    # initialise dict with empty lists
    calculations = {
      'mean': [[], [], None],
      'variance': [[], [], None],
      'standard deviation': [[], [], None],
      'max': [[], [], None],
      'min': [[], [], None],
      'sum': [[], [], None]
    }

    # loop through 3 cols and 3 rows
    for i in range(0, 3):
        # slice the arr
        axis0 = arr[:, i]
        axis1 = arr[i]

        # mean
        calculations['mean'][0].append(axis0.mean())
        calculations['mean'][1].append(axis1.mean())

        # variance
        calculations['variance'][0].append(axis0.var())
        calculations['variance'][1].append(axis1.var())

        # standard deviation
        calculations['standard deviation'][0].append(axis0.std())
        calculations['standard deviation'][1].append(axis1.std())
       
        # max
        calculations['max'][0].append(axis0.max())
        calculations['max'][1].append(axis1.max())

        # min
        calculations['min'][0].append(axis0.min())
        calculations['min'][1].append(axis1.min())

        # sum
        calculations['sum'][0].append(axis0.sum())
        calculations['sum'][1].append(axis1.sum())

    # flattened
    calculations['mean'][2] = arr.mean()
    calculations['variance'][2] = arr.var()
    calculations['standard deviation'][2] = arr.std()
    calculations['max'][2] = arr.max()
    calculations['min'][2] = arr.min()
    calculations['sum'][2] = arr.sum()

    return calculations