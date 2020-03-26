using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> builder)
        {
            var options = builder
                .NotEmpty()
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least one upper case character")
                .Matches("[a-z]").WithMessage("Password must contain at least one lower case character")
                .Matches("[0-9]").WithMessage("Password must contain at least one digit")
                .Matches("^[a-zA-Z0-9]").WithMessage("Password must contain at least one special character");

            return options;

        }
    }
}