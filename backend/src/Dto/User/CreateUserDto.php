<?php
namespace App\Dto\User;

use Symfony\Component\Validator\Constraints as Assert;

class CreateUserDto
{
    #[Assert\NotBlank(message: "L'adresse email est obligatoire.")]
    #[Assert\Email(message: "L'adresse email est invalide.")]
    public ?string $email = null;

    #[Assert\NotBlank(message: "Le mot de passe est obligatoire.")]
    #[Assert\Length(min: 8, minMessage: "Le mot de passe doit contenir au moins 8 caractères.")]
    public ?string $password = null;

    #[Assert\NotBlank(message: "Le prénom est obligatoire.")]
    public ?string $firstName = null;

    #[Assert\NotBlank(message: "Le nom est obligatoire.")]
    public ?string $lastName = null;

    #[Assert\NotBlank(message: "Au moins un rôle doit être sélectionné.")]
    public array $roles = [];

    // --- CHAMPS CANDIDAT
    public array $jobTitles = [];
    public array $locations = [];
    public array $contractTypes = [];
}