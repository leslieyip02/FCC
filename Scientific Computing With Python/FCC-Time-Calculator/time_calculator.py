import math

def add_time(start, duration, day=None):
    #print(start, duration)
    startTime = start.split(" ")[0]

    startHour = int(startTime.split(":")[0])
    if start.split(" ")[1] == "PM":
        startHour = startHour + 12
    #print(startHour)
    startMin = int(startTime.split(":")[1])
    #print(startMin)

    addHours = int(duration.split(":")[0])
    addMins = int(duration.split(":")[1])

    newMin = startMin + addMins
    addHours = addHours + math.floor(newMin / 60)
    newMin = newMin % 60
    if newMin < 10:
        newMin = "0" + str(newMin)
  
    newHour = startHour + addHours
    addDays = math.floor(newHour / 24)
    newHour = newHour % 24
    #print(addDays)
    #print(newHour, newMin)

    dayOfTheWeek = ""
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    if day:
        currentDayIndex = days.index(day.capitalize())
        newDayIndex = currentDayIndex + addDays
        if newDayIndex >= 7:
            newDayIndex = newDayIndex % 7 
        dayOfTheWeek = f', {days[newDayIndex]}'
  
    suffix = " AM"
    if newHour == 0:
        newHour = 12
    elif newHour == 12:
        suffix = " PM"
    elif newHour >= 13:
        newHour = newHour - 12
        suffix = " PM"
    daysLater = ""
    if addDays == 1:
        daysLater = " (next day)"
    elif addDays > 1:
        daysLater = f' ({addDays} days later)'
      
    newTime = str(newHour) + ":" + str(newMin) + suffix + dayOfTheWeek + daysLater
    #print(newTime)
        
    return newTime