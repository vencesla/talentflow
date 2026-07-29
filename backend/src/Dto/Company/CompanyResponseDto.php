<?php

namespace App\Dto\Company;

use App\Entity\Company;

final class CompanyResponseDto
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly ?string $siret,
        public readonly ?string $logo,
        public readonly ?string $industry,
        public readonly ?string $website,
        public readonly ?string $address,
        public readonly ?string $zipCode,
        public readonly ?string $city,
        public readonly ?string $country,
        public readonly ?string $description,
    ) {}

    public static function fromEntity(Company $company): self
    {
        return new self(
            id: $company->getId(),
            name: $company->getName(),
            siret: $company->getSiret(),
            logo: $company->getLogo(),
            industry: $company->getIndustry(),
            website: $company->getWebsite(),
            address: $company->getAddress(),
            zipCode: $company->getZipCode(),
            city: $company->getCity(),
            country: $company->getCountry(),
            description: $company->getDescription(),
        );
    }
}