<?php
namespace App\Dto\User;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateUserDto
{
    #[Assert\NotBlank(message: "L'email est obligatoire.")]
    #[Assert\Email(message: "L'email {{ value }} n'est pas un email valide.")]
    public ?string $email = null;

    #[Assert\NotBlank(message: "Le mot de passe est obligatoire.")]
    #[Assert\Length(
        min: 8,
        minMessage: "Le mot de passe doit contenir au moins {{ limit }} caractères."
    )]
    public ?string $password = null;

    #[Assert\NotBlank(message: "Le prénom est obligatoire.")]
    public ?string $firstName = null;

    #[Assert\NotBlank(message: "Le nom est obligatoire.")]
    public ?string $lastName = null;

    #[Assert\Choice(
        choices: ['ROLE_CANDIDATE', 'ROLE_RECRUITER'],
        message: "Le rôle sélectionné n'est pas valide."
    )]
    public string $role = 'ROLE_CANDIDATE';
}