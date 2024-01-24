using System;
using System.Collections.Generic;
using System.IO;
/// <summary>
/// Purpose: Create a program to let the user stored their pet information as well as the 
/// feature to let them check their pet data and the service information based on their pet type and weight
/// 
/// THIS PROJECT CONTAIN THE TEST DATA NAMED ""pet.csv"" AND ITS ALREADY FILLED WITH 2 different kind of pet
///  
/// Author: The Thinh Nguyen
/// Last modified: 2023.08.11
/// </summary>
class Program
{
    static List<Pet> petList = new List<Pet>();
    static string Path = "../../../pet.csv";

    static string Displaymainmenu()
    {
        Console.WriteLine("|------------------------------------|");
        Console.WriteLine("|              Pet Clinic            |");
        Console.WriteLine("|------------------------------------|");
        string optionmain = "";
        Console.WriteLine("[A] Enter new pet ");
        Console.WriteLine("[L] Searching pet");
        Console.WriteLine("[D] Service pet");
        Console.WriteLine("[R] Remove pet");
        Console.WriteLine("[S] Save the pet");
        Console.WriteLine("[x] Exit the Program");
        optionmain = Console.ReadLine();
        return optionmain;
    }
    static string Displayservicemenu()
    {
        string optionservice = "";
        Console.WriteLine("[P] Pain Killer dosage");
        Console.WriteLine("[S] Sedative dosage");
        Console.WriteLine("[B] Both Pain Killer and Sedative dosages");
        Console.WriteLine("[G] Go back to the main menu"); 
        Console.WriteLine("[x] Exit the Program");
        optionservice = Console.ReadLine();
        return optionservice;
    }
    static void Main(string[] args)
    {
        bool exit = true;
        string optionmain = "";
        
        Loadpet();
        while (exit)
        {
            optionmain = Displaymainmenu().ToLower();
            switch (optionmain)
            {
                case "a": //Let the user add their pet information 
                          ///and also after enter information ask thhe user to see if they want to keep countinue to other service or not
                          ///if not then asking the user to see if they want to save their data before exit or not        
                    AddNewPet();
                    string countinue = Prompt("Do you want to keep processing to the pet service (Y/N): ");
                    if (countinue.ToLower() == "n")
                    {
                        string saveornot = Prompt("Do you wanna save your Pet before exit (Y/N): ");
                        if (saveornot.ToLower() == "y")
                        {
                            Savepet();
                            exit = false;
                        }
                        else
                        {
                            exit = false;
                        }
                    }
                    break;
                      case "d":
                    bool back = true; /// Let the user to choose their service they want by using their pet name to use
                                      ////and also allow them to go back to the main menu or exit the program
                    string optionservice = "";
                    while (back)
                    {
                        optionservice = Displayservicemenu().ToLower();
                        switch (optionservice)
                        {

                            case "p":
                                Servicecal("Carprofen");
                                break;
                            case "s":
                                Servicecal("Acepromazine");
                                break;
                            case "b":
                                Servicecal("Both");
                                break;
                            case "g":
                                back = false;
                                break;
                            case "x":
                                Savepet();
                                Console.WriteLine("Thank you for coming to the Pet clinic");
                                exit = false;
                                break;
                            default:
                                Console.WriteLine("Invalid option.");
                                break;
                        }

                    }
                    break;
                    
     
                    case "l"://let the user searching their new pet
                        Searchpet();                  
                        break;
                    case "r"://let the user remove their pet from the list
                        RemovePet();
                        break;
                    case "s":
                        Savepet();
                          Console.WriteLine("save completely  success");
                    break;
                case "e":
                    Savepet();
                    break;
                case "x":
                    string save = Prompt("Do you wanna save your Pet before exit (Y/N): ");
                    if (save.ToLower() == "y")
                    {
                        Savepet();
                        exit = false;
                    }
                    else
                    {
                        exit = false;
                    }
                    break;
                default:
           
                        Console.WriteLine("Invalid choice. Please select again.");
                        break;
                }
             
            }

    }
    static void Servicecal(string service)
    {  // Search for the pet to use the service
        Pet selectedPet = Searchpet();

        if (selectedPet != null)
        {
            if (service == "Carprofen")
            {
                Console.WriteLine("Your pet requires: {0:F3}ml of Carprofen", selectedPet.Carprofen());
            }
            else if (service == "Acepromazine")
            {
                Console.WriteLine("Your pet requires: {0:F3}ml of Acepromazine", selectedPet.Acepromazine());
            }
            else if (service == "Both")
            {
                Console.WriteLine("Your pet requires: {0:F3}ml of Carprofen", selectedPet.Carprofen());
                Console.WriteLine("Your pet requires: {0:F3}ml of Acepromazine", selectedPet.Acepromazine());
            }
        }
    }
    static void Loadpet()
    {
        if (File.Exists(Path))
        {
            using (StreamReader reader = new StreamReader(Path))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    string[] file = line.Split(',');
                    string name = file[0];
                    int age = int.Parse(file[1]);
                    double weight = double.Parse(file[2]);
                    string type = file[3];
                    petList.Add(new Pet(name, age, weight, type));
                }
            }
        }
    }

    static void Savepet()
    {
        using (StreamWriter writer = new StreamWriter(Path))
        {
            foreach (Pet pet in petList)
            {
                writer.WriteLine($"{pet.Name},{pet.Age},{pet.Weight},{pet.Type}");
            }
        }
    }

    static void AddNewPet()//Let the user add their pet information 
    {
        while (true)
        {
            Console.Write("Enter pet name: ");
            string name = Console.ReadLine();
            Console.Write("Enter pet age: ");
            int age;

            if (!int.TryParse(Console.ReadLine(), out age))
            {
                Console.WriteLine("Invaliddddd age . Please try again only INTERGERRR\n");
                continue;
            }

            Console.Write("Enter pet weight: ");
            double weight;

            if (!double.TryParse(Console.ReadLine(), out weight))
            {
                Console.WriteLine("Invalid weight input. Please enter a valid number.\n");
                continue;
            }

            Console.Write("Enter pet type Dog or Cat : ");
            string type = Console.ReadLine();
            if(type != "Dog" &&  type != "Cat")
            {
                Console.WriteLine("Invalid nameeeee. We just accept !!remember enter exactly Dog Or Cat (note: Captital D and C also thank you <3) \n");
                continue;
            }
            try
            {
                Pet newPet = new Pet(name, age, weight, type);
                petList.Add(newPet);
                Console.WriteLine("Pet added successfully!");
                break; 
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine("Input invaaaliddd please try again.");
            }
        }
 
    }

    static Pet Searchpet()//let the user searching their pet and return the pet info
    {
        Console.Write("Enter your pet name: ");
        string Name = Console.ReadLine();

        Pet petname = petList.Find(pet => pet.Name.Equals(Name, StringComparison.OrdinalIgnoreCase));

        if (petname != null)
        {
            Console.WriteLine($"Name: {petname.Name} Age: {petname.Age}, Weight: {petname.Weight}, Type: {petname.Type}");
        }
        else
        {
            Console.WriteLine("Pet not exists 😒.");
        }
        return petname;
    }

    static void RemovePet()
    {
        Console.Write("Enter pet name to remove: ");
        string removepet = Console.ReadLine();

        Pet petname = petList.Find(pet => pet.Name.Equals(removepet, StringComparison.OrdinalIgnoreCase));

        if (petname != null)
        {
            petList.Remove(petname);
            Console.WriteLine("Pet removed successfully!");
        }
        else
        {
            Console.WriteLine("Pet not exists 😒.");
        }
    }
    static string Prompt(string promptString)
    {
        //a prompt for the user to enter input
        Console.Write(promptString);
        return Console.ReadLine();
    }
}

