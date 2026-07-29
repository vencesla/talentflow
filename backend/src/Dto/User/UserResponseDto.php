<?php

namespace App\Dto\User;

use App\Entity\User;

final class UserResponseDto
{
    public function __construct(
        public int $id,
        public string $email,
        public ?string $firstName,
        public ?string $lastName,
        public string $createdAt,
        public bool $hasCompany,
        public ?int $companyId,
        public ?array $roles,
        public ?array $jobTitles = null,
        public ?array $locations = null,
        public ?array $contractTypes = null
    ) {}

    public static function fromEntity(User $user): self
    {
        $company = $user->getCompany();

        return new self(
            id: $user->getId(),
            email: $user->getEmail(),
            firstName: $user->getFirstName(),
            lastName: $user->getLastName(),
            createdAt: $user->getCreatedAt()->format('Y-m-d'),
            hasCompany: $company !== null,
            companyId: $company?->getId(),
            roles: $user->getRoles(),
            jobTitles: $user->getJobTitles(),
            locations: $user->getLocations(),
            contractTypes: $user->getContractTypes()
        );
    }
}