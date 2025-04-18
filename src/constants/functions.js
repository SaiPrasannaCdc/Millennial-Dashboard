export const capitalizeFirstLetter = (sentence) => {
    if (!sentence) return sentence;
    return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
}

export const  adjustArrayToHaveMinimumDistance = (arr, minDiff, min, max) =>
{
    if(arr.length < 2)
    {
        return arr;
    }   
    
	const adjusted = [arr[0]];
	
	for (let i=1;i < arr.length; i++)
	{
		let nextValue = adjusted[adjusted.length - 1] + minDiff;
		
		adjusted.push(Math.max(nextValue, arr[i]));
	}
	
	for ( let i =1; i < adjusted.length; i++)
	{
		if (adjusted[i] <= adjusted[i-1] + minDiff)
		{
			adjusted[i] = adjusted[i-1] + minDiff;
		}
	}

    if(adjusted[adjusted.length-1] > max)
    {
        for (let i = adjusted.length-1; i >= 0; i--)
        {
            if(i == adjusted.length-1)
             {   
                if( adjusted[i] - arr[i] > 0)
                    adjusted[i] = arr[i];
             }
             else 
             {
                if(adjusted[i]> adjusted[i+1] || adjusted[i+1] - adjusted[i] < minDiff)
                    adjusted[i] = adjusted[i+1] - minDiff; 
             }
        }
    }
	
	return adjusted;
}