using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrainSystem
{
    public static class Utilities
    {
        public static bool IsPostiveNonZero(double value)
        {
            bool valid = true;
            if (value <= 0)
            {
                valid = false;
            }
            return valid;

        }

        public static bool InHundreds(int value)
        {
            bool valid = true;
            if (value % 100 != 0)
            {
                valid = false;
            }
            return valid;

        }
    }
}
