//add project dependency to TrainSystem
using FluentAssertions;
using TrainSystem;

namespace UnitTestingEx1
{
    public class EngineTests
    {
        #region Successful tests
        [Fact]
        public void Create_A_Good_Engine()
        {
            //Given - Arrange
            string Model = "CP 8002";
            string SerialNumber = "12345";
            int Weight = 147000;
            int HorsePower = 4400;
           
            //When - Act
            Engine actual = new Engine(Model, SerialNumber, Weight, HorsePower);
            //Then - Assert
            actual.Model.Should().Be(Model);
            actual.SerialNumber.Should().Be(SerialNumber);
            actual.Weight.Should().Be(Weight);
            actual.HorsePower.Should().Be(HorsePower);
            actual.InService.Should().BeTrue();
        }

        [Theory]
        [InlineData("CP 8002,12345,147000,4400,True")]
        public void Display_Engine_Data_ToString(string expectedEngineString)
        {
            //Given - Arrange
             Engine actual = new Engine("CP 8002", "12345", 147000, 4400);
            //When - Act
            var actualEngineString = actual.ToString();
            //Then - Assert
           actualEngineString.Should().Be(expectedEngineString);
        }

        [Theory]
        [InlineData(148000)]
        public void Change_Engine_Weight( int expectedEngineWeight)
        {
            //Given - Arrange
            Engine actual = new Engine("CP 8002", "12345", 147000, 4400);
            actual.InService=false;
         
            //When - Act
            actual.Weight = 148000;

            //Then - Assert
            actual.Weight.Should().Be(expectedEngineWeight);
        }

        [Theory]
        [InlineData(4700)]
        public void Change_Engine_HorsePower(int expectedEngineHorsePower)
        {
            //Given - Arrange
            Engine actual = new Engine("CP 8002", "12345", 147000, 4400);
            actual.InService=false;

            //When - Act
            actual.HorsePower = 4700;

            //Then - Assert - using the FluentAssertions NuGet package
            actual.HorsePower.Should().Be(expectedEngineHorsePower);
        }
        #endregion

        #region Exception testing
        //exceptions
        [Theory]
        [InlineData(null, "12345", 147000, 4400)]
        [InlineData("", "12345", 147000, 4400)]
        [InlineData("   ", "12345", 147000, 4400)]
        [InlineData("CP 8002", null, 147000, 4400)]
        [InlineData("CP 8002", "", 147000, 4400)]
        [InlineData("CP 8002", "  ", 147000, 4400)]
        public void Creating_Engine_Should_Throw_ArgumentNullException(string Model,
            string SerialNumber, int Weight, int HorsePower)
        {
            //Given - Arrange
            //When - Act
            Action action = () => new Engine(Model, SerialNumber, Weight, HorsePower);
            //Then - Assert
            action.Should().Throw<ArgumentNullException>();
        }

        [Theory]

        [InlineData("CP 8002", "12345", 0, 4400)]
        [InlineData("CP 8002", "12345", -147000, 4400)]
        [InlineData("CP 8002", "12345", 147110, 4400)]
        [InlineData("CP 8002", "12345", 147000, 0)]
        [InlineData("CP 8002", "12345", 147000, -4400)]
        [InlineData("CP 8002", "12345", 147000, 4410)]
        [InlineData("CP 8002", "12345", 147000, 2400)]
        [InlineData("CP 8002", "12345", 147000, 6400)]
        public void Creating_Engine_Should_Throw_ArgumentException(string Model,
          string SerialNumber, int Weight, int HorsePower)
        {
            //Given - Arrange
            //When - Act
            Action action = () => new Engine(Model, SerialNumber, Weight, HorsePower);
            //Then - Assert
            action.Should().Throw<ArgumentException>();
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-148000)]
        [InlineData(148110)]
        public void Change_Engine_Weight_Should_Throw_ArgumentException(int ChangeWeight)
        {
            //Given - Arrange
            Engine actual = new Engine("CP 8002", "12345", 147000, 4400);
            actual.InService = false;

            //When - Act

            Action action = () => actual.Weight = ChangeWeight;

            //Then - Assert
            action.Should().Throw<ArgumentException>();

        }

        [Theory]
        [InlineData(148000)]
        public void Change_InService_Engine_Weight_Should_Throw_InvalidOperationException(int ChangeWeight)
        {
            //Given - Arrange
            Engine actual = new Engine("CP 8002", "12345", 147000, 4400);


            //When - Act
            Action action = () => actual.Weight = ChangeWeight;

            //Then - Assert
            action.Should().Throw<InvalidOperationException>();
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-4500)]
        [InlineData(4410)]
        [InlineData(2400)]
        [InlineData(6400)]
        public void Change_Engine_HorsePower_Should_Throw_ArgumentException(int ChangeHorsePower)
        {
            //Given - Arrange
            Engine actual = new Engine("CP 8002", "12345", 147000, 4400);

            //When - Act
            Action action = () => actual.HorsePower = ChangeHorsePower;
            actual.InService = false;

            //Then - Assert
            action.Should().Throw<ArgumentException>();
        }

        [Theory]
        [InlineData(4500)]
        public void Change_InService_Engine_HorsePower_Should_Throw_InvalidOperationException(int ChangeHorsePower)
        {
            //Given - Arrange
            Engine actual = new Engine("CP 8002", "12345", 147000, 4400);

            //When - Act
            Action action = () => actual.HorsePower = ChangeHorsePower;

            //Then - Assert
            action.Should().Throw<InvalidOperationException>();
        }
        #endregion
    }
}