
namespace TrainSystem
{
    public class Engine
    {
        private int _HorsePower;
        private int _Weight;

        public string Model { get; private set; }
        public string SerialNumber { get; private set; }
        public bool InService
        {
            get; set;
        }
        public int Weight
        {
            get { return _Weight; }
            set
            {
                if (!InService)
                {
                    if (!Utilities.IsPostiveNonZero(value))
                    {
                        throw new ArgumentException("Weight must be a positive, non-zero value.");
                    }
                    if (!Utilities.InHundreds(value))
                    {
                        throw new ArgumentException("Weight must be in 100 unit increments.");
                    }
                    _Weight = value;
                }
                else
                {
                    throw new InvalidOperationException("Cannot change weight while engine is in service.");
                }
            }
        }
        public int HorsePower
        {
            get { return _HorsePower; }
            set
            {
                if (!InService)
                {
                    if (value < 3500 || value > 5500)
                    {
                        throw new ArgumentException("Horse Power must be between 3500 and 5500 ");
                    }

                    if (value % 100 != 0)
                    {
                        throw new ArgumentException("Horse Power must be 100 HP increments.");
                    }
                    _HorsePower = value;
                }
                else
                {
                    throw new InvalidOperationException("Cannot change horse power while engine is in service.");
                }
            }
        }
        public Engine(string model, string serialnumber, int weight, int horsepower)
        {
            if (string.IsNullOrWhiteSpace(model))
            {
                throw new ArgumentNullException("Model cannot be null or empty.");

            }
            Model = model.Trim();


            if (string.IsNullOrWhiteSpace(serialnumber))
            {
                throw new ArgumentNullException("Serial Number cannot be null or empty.");
            }
            SerialNumber = serialnumber.Trim();




            Weight = weight;
            HorsePower = horsepower;
            InService = true;
        }
        public override string ToString()
        {
            return $"{Model},{SerialNumber},{Weight},{HorsePower},{InService}";
        }

    }
}