using Microsoft.VisualBasic;
using System;
using System.Collections;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Numerics;
using System.Reflection.PortableExecutable;
using System.Runtime.ExceptionServices;
using System.Runtime.Intrinsics.Arm;
using System.Xml.Linq;
using static System.Net.WebRequestMethods;
using static System.Runtime.InteropServices.JavaScript.JSType;
/// <summary>
/// Purpose: Create a program to let the user stored their pH and dates as well as the 
/// feature to let them check their data and display the analysis information
/// 
/// THIS PROJECT CONTAINT THE TEST DATA NAMED TESTDATA.CSV AND ITS ALREADY FILLED WITH 31 DAY
///  
/// Author: The Thinh Nguyen
/// Last modified: 2023.08.02
/// </summary>
namespace Assignment_3

{
    internal class Program
    {
        const int limitday = 31;
        const string path = "../../../Data";
        static string DisplayMainMenu()
        {
            string optionmain = "";

            Console.Clear();
            Console.WriteLine("(C) Enter daily pH values and dates: ");
            Console.WriteLine("(S) Save your data: ");
            Console.WriteLine("(L) Load your data: ");
            Console.WriteLine("(D) Display The Current Entries: ");
            Console.WriteLine("(E) Edit pH value: ");
            Console.WriteLine("(A) Analysis Menu: ");
            Console.WriteLine("(X) Press X to exit: ");
            Console.WriteLine("Enter your choice: ");


            optionmain = Console.ReadLine();

            return optionmain;
        }
        static string DisplayAnalysisMenu()
        {
            string option = "";

            Console.Clear();
            Console.WriteLine("(C) Chart of Entries: ");
            Console.WriteLine("(A) Mean Average pH:");
            Console.WriteLine("(H) Highest pH: ");
            Console.WriteLine("(L) Lowest pH: ");
            Console.WriteLine("(M) Median pH: ");
            Console.WriteLine("(X) Press X to go back to Main MENU: ");

            option = Console.ReadLine();

            return option;

        }
        static void Main(string[] args)
        {

            double[] pHValues = new double[limitday];
            string[] dates = new string[limitday];
            int count = 0;
            string optionmain = "";
            string option = "";
            bool exit = false;
          

            while (!exit)//let user choose the option they want
            {
                optionmain = DisplayMainMenu().ToLower();
                switch (optionmain)
                {
                    case "c":
                        //Let the user enter the pH and date
                        EnterLogEntries(pHValues, dates, ref count);
                        break;                
                    case "d":
                        //display the data that user have input 
                        DisplayEntries(pHValues, dates, count);
                        Console.WriteLine("\n\nPress any key to continue...");
                        Console.ReadKey();
                        break;
                    case "e":
                        //edit the pHvalue 
                        EditEntries(pHValues, dates, count);
                        break;
                    case "s":
                        //save the data
                        string filename = "";
                        SaveLogFile(filename, pHValues, dates, count);
                        break;
                    case "l":
                        //load the data
                        count = 0;
                        pHValues = new double[limitday];
                        dates = new string[limitday];
                        LoadLogFile(pHValues, dates,ref count);
                        break;
                    case "a"://display the analysis menu
                        bool back = false;                      
                        while (!back)
                        {
                            option = DisplayAnalysisMenu().ToLower();
                            filename = "";
                            switch (option)
                            {
                                case "c":
                                    //Display the Chart of entries
                                    DisplayChart(filename, pHValues, dates, count);
                                    break;
                                case "a":
                                    //Display the average pH
                                    MeanOfAverage(pHValues, count);
                                    break;
                                case "h":
                                    // Display highest pH                                   
                                    Console.WriteLine("Highest pH :{0}", Max(pHValues, count));
                                    Console.ReadKey();
                                    break;
                                case "l":
                                    // Display lowest pH
                                    Console.WriteLine("Lowest pH :{0}", Min(pHValues, count));
                                    Console.ReadKey();
                                    break;
                                case "m":
                                    //Display the Median pH
                                    Console.WriteLine("Median pH = {0} ", Median(pHValues, count));
                                    Console.ReadKey();
                                    break;
                                case "x":
                                     back = true; //Need to change this to go back to the main menu
                                    break;
                                default:
                                    Console.WriteLine("Invalid option, press any key...");
                                    Console.ReadKey();
                                    break;
                            }

                        }
                        break;
                    case "x":
                        exit = true;
                        break;
                    default:
                        Console.WriteLine("Invalid option, press any key to continue.");
                        Console.ReadKey();
                        break;
                }               
            }
        }

        static double Median(double[] nums, int count)
        {
            // find the median of in pH array
            if (count % 2 != 0)
                return (double)nums[count / 2];
            return (double)(nums[(count - 1) / 2] + nums[count / 2]) / 2.0;
        }
        static void DisplayChart(string filename, double[] pHValues, string[] dates, int count)
        {
            // display the chart based on the min and max ph 
            Console.WriteLine("\nChart of Entry Data");
            Console.WriteLine("===================\n");
            Console.WriteLine("pH");
            Console.WriteLine("----");

            double min = Min(pHValues,count);
            double max = Max( pHValues, count);


            for (double i = max; i >= min; i -= 0.1)
            {
                Console.WriteLine(" {0:0.0}|", i);
            }
            for (int i = 0; i < count * 3 + 5; i++)
            {
                Console.Write("-");
            }
            Console.Write("\nDay |");
            for (int i = 0; i < count; i++)
            {
                Console.Write(" {0:00}", DateTime.Parse(dates[i]).Day);
                //saving cursor position as a reference
                int left = Console.GetCursorPosition().Left;  //X-axis
                int top = Console.GetCursorPosition().Top;    //Y-axis
                //Add offset of 2, in reality 2.5 to handle the rounding
                Console.SetCursorPosition(left - 1, top - (int)((pHValues[i] - min) * 10 + 2.5));
                Console.Write('*');
                Console.SetCursorPosition(left, top);
            }
            Console.WriteLine();
            Console.WriteLine();
            Console.WriteLine("Press any key to continue...");
            Console.ReadKey(); 
        }
        static void EditEntries(double[] pHValues, string[] dates, int count)
        {
            // This is for the user edit their entries 
            bool checkday = true;
            Console.WriteLine("===== View and Edit pH Values =====");
            Console.WriteLine("Date\t\tpH Value");
            Console.WriteLine("------------------------");
            // use for loop to display the array of date and pHValues
            for (int i = 0; i < count; i++)
            {
                Console.Write("{0, -10}", dates[i]);
                Console.WriteLine("{0, 10}", pHValues[i]);
            }
            while (checkday)/// Let the user enter the date and that they want to edit
                            /// Also to check is it that date in the table or not
            {
                string dayenter = Prompt("\nBefore enter remember enter exactly the format and add [-] between number \nEnter the date you want to edit (DD-MM-YYYY) or press [x] to exit: ");
                if (dayenter.ToLower() == "x") { checkday = false; }
                for (int i = 0; i < count; i++)
                {
                    if (dayenter == dates[i])
                    {
                        double option = PromptDouble("\"Choose the option for edit [1] Change date, [2] Change pH: ");
                        switch (option)
                        {
                            case 1:
                                while (true)
                                {
                                    string newday = Prompt("enter new the day you want to change (DD-MM-YYYY): ");
                                    DateTime dt;
                                    // Check the date input is it valid or not                                  
                                    if (!DateTime.TryParseExact(newday, "MM-dd-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dt))
                                    {
                                        Console.WriteLine("Invalid date format....");

                                    }
                                    else if (dates[i] == newday)
                                    {
                                        Console.WriteLine("There is No Duplicate Day Allowed...:)) ");
                                    }
                                    else
                                    {
                                        System.String.Format("{0:MM-dd-yyyy}", dt);
                                        dates[i] = newday;
                                        Console.WriteLine($"The day {dayenter} have changed to {newday} successfully");
                                        break;
                                    }
                                }
                                break;
                            case 2:
                                while (true)
                                {
                                    double newpH = PromptDouble("enter the pH you wanna change: : ");
                                    //check the pH input right or not (0 < pH < 14)                 
                                    if (newpH > 14)
                                    {
                                        Console.WriteLine("pH should less than 14");
                                    }
                                    else if (newpH < 0)
                                    {
                                        Console.WriteLine("pH should greater than 0");
                                    }
                                    else
                                    {
                                        Console.WriteLine($"You have changed successfully the pH of day {dayenter} to {newpH}");
                                        pHValues[i] = newpH;
                                        break;
                                    }

                                }
                                break;
                            default:
                                Console.WriteLine("Invalid option, press any key to continue.");
                                break;
                        }
                    }

                }
            }
        }
        static void DisplayEntries(double[] pHValues, string[] dates, int count)
        {
            //display the data that user have input in array
            Console.WriteLine("Current Log entries");
            Console.WriteLine("========================\n");
            Console.WriteLine("Date\t\tpH Value");
            Console.WriteLine("------------------------");
            // use for loop to display the array of date and pHValues
            for (int i = 0; i < count; i++)
            {
                Console.Write("{0, -10}", dates[i]);
                Console.WriteLine("{0, 10}", pHValues[i]);           
            }

        }
        static void SaveLogFile(string filename, double[] pHValues, string[] dates, int count)
        {
            // this use for let the user save their data

            // check the data is exist or not
            bool checkfileexist = true; 
            while (checkfileexist)
            {
                //let the user named their file
                filename = Prompt(" Enter your filename want to save + (type of your file like : filename.txt or filename.csv ,etc..): ") ;
                //if the data exist let the user know if not keep processing to saving file
                string filePath = System.IO.Path.Combine(path, filename);//combine the path + filename of user 
                if (System.IO.File.Exists(filePath))
                {
                    Console.WriteLine(" Your file name already exist, try another one ... :V ");
                }
                else
                {                               
                    using (StreamWriter writer = new StreamWriter(filePath))
                    {
                        writer.WriteLine("Date,pH Value");
                        for (int i = 0; i < count; i++)
                        {
                            writer.WriteLine("{0},{1}", dates[i] ,pHValues[i]);
                        }
                        writer.Close();
                        Console.WriteLine("File saved successful ...Press any key to continue... :>");
                        Console.ReadKey();
                        checkfileexist = false;
                    }                                    
                }
            }
        }
        static int LoadLogFile(double[] pHValues, string[] dates,ref int count)
        {
          
            //Load all the entires that were saved in the file + check if that file exists or not
            bool checkfileavailable = true;
            while (checkfileavailable)
            {
                string filename = Prompt(" When enter you file name remember include the type of that file also like filename.txt or filename.csv ,etc.. \nEnter Your file Name: ");
                string filePath = System.IO.Path.Combine(path, filename);//combine the path + filename of user 
                if (!System.IO.File.Exists(filePath))
                {
                    Console.WriteLine("File not found. Please try again.");
                }
                else
                {
                    string[] files = System.IO.File.ReadAllLines(filePath);
                    files = files.Skip(1).ToArray();//skip the headerline
                    for (int i = 0; i < files.Length; i++)
                    {
                        pHValues[i] = Double.Parse(files[i].Split(',')[1]);
                        dates[i] = files[i].Split(',')[0];
                        count++;
                    }
                }
                checkfileavailable = false;
            }
            Console.WriteLine($"\n\nLoaded {count} records from the log file.");
            Console.ReadKey();
            return count;
        }
        static int EnterLogEntries(double[] pHValues, string[] dates, ref int count)
        {
            //add constraint for the input of user and modify the format of date
            //as well as add the Constraint pHvalue input

            string date = "";
            bool validformat = true;
            bool format = true;
            while (validformat)// Check the date input is it valid or not
            {              
                while (format)
                {
                    DateTime dt;
                    date = Prompt("Enter a date (MM-dd-yyyy): ");
                    if (DateTime.TryParseExact(date, "MM-dd-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dt))
                    {
                        System.String.Format("{0:MM-dd-yyyy}", dt);
                        format = false;
                        for (int i = 0; i < count; i++)
                        {
                            if (dates[i] == date)
                            {
                                Console.WriteLine("There is No Duplicate Day Allowed...:)) ");
                                format = true;
                            }
                        }
                        validformat = false;
                    }
                    else
                    {
                        Console.WriteLine("Invalid date format....");
                    }
                }                       
            }        
            double pHValue;
            while (true)
            {
                //check the pH input right or not (0 < pH < 14)
                pHValue = PromptDouble("Enter pH: ");
                if (pHValue > 14)
                {
                    Console.WriteLine("pH should less than 14");
                }
                else if (pHValue < 0.1)
                {
                    Console.WriteLine("pH should greater than 0");
                }
                else
                {
                    break;
                }
            }      
            Enterdata(pHValues, pHValue, dates, date, ref count);
            Console.WriteLine("Press any key to countinue...");
            Console.ReadKey();

            return count;
        }

        static double PromptDouble(string promptString)
            // check the valid input of user 
        {
            while (true)
            {
                string input = Prompt(promptString);
                if (double.TryParse(input, out double number))
                    return number;
                Console.WriteLine("Invalid input. Please enter a valid(Number ONLY).\n");
            }
        }
        static string Prompt(string promptString)
        {
            //a prompt for the user to enter input
            Console.Write(promptString);
            return Console.ReadLine();
        }
        static void Enterdata(double[] pHValues,double pHValue, string[] dates, string date, ref int count)
        {
            // check the maximum input that the user can enter
            if (count < dates.Length)
            {
                pHValues[count] = pHValue;
                dates[count] = date;
                count++;
            }
            else
            {
                Console.WriteLine("You have reached the maximum dates, press any key...");
                Console.ReadKey();
            }

        }
        static double Max(double[] pHValues,int count)
        {
            //use to display the highest pH
            double max = pHValues[0];
            for (int i = 0; i < count; i++)
            {
                if (pHValues[i] > max)
                    max = pHValues[i];
            }
            return max;
        }
        static double Min(double[] pHValues, int count)
        {
            //use to display the Lowest pH
            double min = pHValues[0];
            for (int i = 0; i < count; i++)
            {
                if (pHValues[i] < min)
                    min = pHValues[i];
             
            }
            return min;
        }
        static  void MeanOfAverage(double[] pHValues, int count)
        {
            //display the pH average
            double sum = 0;
            double average = 0;

            for (int i = 0; i < count; i++)
            {
                sum += pHValues[i];
            }
            average = sum / count;

            Console.WriteLine("Mean Average pH: {0:0.00}", average);          
            Console.ReadKey();
        }           
    }
}