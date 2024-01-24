using System;
/// <summary>
/// Purpose: Create a program to let the user stored their pet information as well as the 
/// feature to let them check their pet data and the service information based on their pet type and weight
/// 
/// THIS PROJECT CONTAIN THE TEST DATA NAMED ""pet.csv"" AND ITS ALREADY FILLED WITH 2 different kind of pet
///  
/// Author: The Thinh Nguyen
/// Last modified: 2023.08.11
/// </summary>
class Pet
{
    //set  defaut value for the pet
    private string name = "Spot";
    private int age = 1;
    private double weight = 5;
    private string type = "Dog";
    //check and validate the input of user for all  of the data  
    //  porperty to get or set for all the pet data enter
    public string Name
    {
        get { return name; }
        set
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Name must contain at least one non-white space character.");
            }
            name = value;
        }
    }
    public int Age
    {
        get { return age; }
        set
        {
            if (value < 1)
            {
                throw new ArgumentException("Age must be one or greater.");
            }
            age = value;
        }
    }
    public double Weight
    {
        get { return weight; }
        set
        {
            if (value < 5)
            {
                throw new ArgumentException("Weight must be five or greater.");
            }
            weight = value;
        }
    }
    public string Type
    {
        get { return type; }
        set { type = value; }
    }
    //initialize the pet with provided values
    public Pet(string name, int age, double weight, string type)
    {
        Name = name;
        Age = age;
        Weight = weight;
        Type = type;
    }

    // Calculate acepromazine,carprofen and transfer pound to kg by mutiply by 0.453592
    public double Acepromazine()
    {  
        double mgPerMl = 10;
        double mgPerKg = Type == "Dog" ? 0.030 : 0.002;
        return (Weight * 0.453592) * (mgPerKg / mgPerMl);
    }

    public double Carprofen()
    {
        double mgPerMl = 12;
        double mgPerKg = Type == "Dog" ? 0.500 : 0.25;
        return (Weight * 0.453592) * (mgPerKg / mgPerMl);
    }


}






