import json

# We will have to make a number of special exceptions
def main():
    with open("crafting.json") as j:
        data = json.load(j)
    with open("items.json") as j:
        items = json.load(j)
    reverseItems = {v:k for k,v in items.items()}

    # Data is broken down by recipe not resource, we
    # Aim to flip that and then find the best recipes
    resourceDict = {}
    resourceToRecipeList = {}
    cleanIngredient = {}
    for recipeID, info in data.items():
        xp = info["craftingExperience"]
        recipeList = info["requiredResources"]
        for recipe in recipeList:
            if len(recipe) == 1:
                for k,v in recipe.items():
                    if k not in cleanIngredient:
                        cleanIngredient[k] = 0
                    cleanIngredient[k] = max(cleanIngredient[k], xp/eval(v))
            for resource, count in recipe.items():
                ratio = xp/eval(count)
                if resource not in resourceToRecipeList:
                    resourceToRecipeList[resource] = []
                rekipe = { 'xp': xp, 'recipe': recipe, 'id': recipeID }
                resourceToRecipeList[resource].append( rekipe )
                try:
                    rsname = items[resource]
                    if rsname not in resourceDict:
                        resourceDict[rsname] = []
                    resourceDict[rsname].append(ratio)
                except KeyError:
                    pass
    ## We can make some general exceptions here
    cleanIngredient[ reverseItems['Heat'] ] = 0
    cleanIngredient[ reverseItems['Ichor'] ] = 0
    cleanIngredient[ reverseItems['Gold Ring'] ] = 0
    cleanIngredient[ reverseItems['Gold Necklace'] ] = 0
    cleanIngredient[ reverseItems['Burnt Fish'] ] = 0
    cleanIngredient[ reverseItems['Nature Essence'] ] = 0
    cleanIngredient[ reverseItems['Fire Essence'] ] = 0
    cleanIngredient[ reverseItems['Water Essence'] ] = 0
    cleanIngredient[ reverseItems['Chaos Essence'] ] = 0
    cleanIngredient[ reverseItems['Blood Essence'] ] = 0
    cleanIngredient[ reverseItems['Death Essence'] ] = 0
    cleanIngredient[ reverseItems['Fire Rune'] ] = 0
    cleanIngredient[ reverseItems['Goblin Brain'] ] = 0
    cleanIngredient[ reverseItems['Fire Talisman'] ] = 0


    ## Now that we have a set of clean ingredients, we can make a second pass
    ## To approximate others
    newCleanIngredient = {}
    for recipeID, info in data.items():
        xp = info["craftingExperience"]
        recipeList = info["requiredResources"]
        for recipe in recipeList:
            extraCount = 0
            for resource, count in recipe.items():
                if resource in cleanIngredient:
                    xp -= cleanIngredient[resource]*eval(count)
                else:
                    extraCount += 1
            if extraCount == 1:
                for k,v in recipe.items():
                    if k not in cleanIngredient:
                        if k not in newCleanIngredient:
                            newCleanIngredient[k] = 0
                        newCleanIngredient[k] = max(newCleanIngredient[k], xp/eval(v))

    ## Combine and do a third pass
    for k,v in newCleanIngredient.items():
        cleanIngredient[k] = v

    newCleanIngredient = {}
    for recipeID, info in data.items():
        xp = info["craftingExperience"]
        recipeList = info["requiredResources"]
        for recipe in recipeList:
            extraCount = 0
            for resource, count in recipe.items():
                if resource in cleanIngredient:
                    xp -= cleanIngredient[resource]*eval(count)
                else:
                    extraCount += 1
            if extraCount == 1:
                for k,v in recipe.items():
                    if k not in cleanIngredient:
                        if k not in newCleanIngredient:
                            newCleanIngredient[k] = 0
                        newCleanIngredient[k] = max(newCleanIngredient[k], xp/eval(v))

    for k,v in newCleanIngredient.items():
        cleanIngredient[k] = v

    newCleanIngredient = {}
    for recipeID, info in data.items():
        xp = info["craftingExperience"]
        recipeList = info["requiredResources"]
        for recipe in recipeList:
            extraCount = 0
            for resource, count in recipe.items():
                if resource in cleanIngredient:
                    xp -= cleanIngredient[resource]*eval(count)
                else:
                    extraCount += 1
            if extraCount == 1:
                for k,v in recipe.items():
                    if k not in cleanIngredient:
                        if k not in newCleanIngredient:
                            newCleanIngredient[k] = 0
                        newCleanIngredient[k] = max(newCleanIngredient[k], xp/eval(v))

    for k,v in newCleanIngredient.items():
        cleanIngredient[k] = v

    newCleanIngredient = {}
    for recipeID, info in data.items():
        xp = info["craftingExperience"]
        recipeList = info["requiredResources"]
        for recipe in recipeList:
            extraCount = 0
            for resource, count in recipe.items():
                if resource in cleanIngredient:
                    xp -= cleanIngredient[resource]*eval(count)
                else:
                    extraCount += 1
            if extraCount == 1:
                for k,v in recipe.items():
                    if k not in cleanIngredient:
                        if k not in newCleanIngredient:
                            newCleanIngredient[k] = 0
                        newCleanIngredient[k] = max(newCleanIngredient[k], xp/eval(v))

    for k,v in newCleanIngredient.items():
        cleanIngredient[k] = v

    ## A little more complex, if it's unknown, lets divide
    ## all unknowns evenly
    newCleanIngredient = {}
    for recipeID, info in data.items():
        xp = info["craftingExperience"]
        recipeList = info["requiredResources"]
        for recipe in recipeList:
            extraCount = 0
            extraThings = 0
            for resource, count in recipe.items():
                if resource in cleanIngredient:
                    xp -= cleanIngredient[resource]*eval(count)
                else:
                    extraCount += 1
                    extraThings += eval(count)
            if extraCount > 1:
                for k,v in recipe.items():
                    if k not in cleanIngredient:
                        if k not in newCleanIngredient:
                            newCleanIngredient[k] = 0
                        newCleanIngredient[k] = max(newCleanIngredient[k], xp/extraThings)

    for k,v in newCleanIngredient.items():
        cleanIngredient[k] = v

    for k,v in cleanIngredient.items():
        try:
            print(items[k], v)
        except:
            pass
    with open("craftingItemValue.json","w") as j:
        json.dump(cleanIngredient, j, indent=2)

if __name__ == '__main__':
    main()
