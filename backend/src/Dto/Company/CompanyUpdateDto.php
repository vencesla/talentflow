<?php
namespace App\Dto\Company;

use Symfony\Component\Validator\Constraints as Assert;

class CompanyUpdateDto
{
    #[Assert\NotBlank(message: "Le nom de l'entreprise est obligatoire.")]
    #[Assert\Length(max: 255)]
    public string $name;

    #[Assert\Regex(
        pattern: '/^[0-9]{14}$/',
        message: 'Le SIRET doit contenir exactement 14 chiffres.'
    )]
    public ?string $siret = null;

    public ?string $description = null;

    #[Assert\Url(message: "L'URL du site web n'est pas valide.")]
    public ?string $website = null;
    public ?string $logo = null;
    public ?string $zipCode = null;
    public ?string $city = null;
    public ?string $country = null;
    public ?string $industry = null;
    public ?string $address = null;

}