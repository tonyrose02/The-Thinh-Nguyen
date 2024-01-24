//add project dependency to TrainSystem
using FluentAssertions;
using TrainSystem;
namespace UnitTestingEx1
{
    public class UtilityTests
    {
        [Fact]
        public void Validate_Numeric_Is_Non_Zero_Positive()
        {
            //Given - Arrange
            int value = 147000;
          

            //When - Act
            bool result = Utilities.IsPostiveNonZero(value);
            //Then - Assert
            result.Should().BeTrue();
        }
        [Fact]
        public void Validate_Numeric_Is_In_Hundreds()
        {
            //Given - Arrange
            int value = 147000;


            //When - Act
            bool result = Utilities.InHundreds(value);
            //Then - Assert
            result.Should().BeTrue();
        }

        //exceptions
        [Theory]
        [InlineData(0)]
        [InlineData(-147000)]
        public void Validate_Numeric_Is_Not_Non_Zero_Positive(int value)
        {
            //Given - Arrange
          
            //When - Act
            bool result = Utilities.IsPostiveNonZero(value);
            //Then - Assert
            result.Should().BeFalse();
        }

        [Theory]
        [InlineData(-147110)]
        public void Validate_Numeric_Is_Not_In_Hundreds(int value)
        {
            //Given - Arrange

            //When - Act
            bool result = Utilities.InHundreds(value);
            //Then - Assert
            result.Should().BeFalse();
        }
    }
}
