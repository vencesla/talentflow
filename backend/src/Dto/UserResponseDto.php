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
    ) {}

    public static function fromEntity(User $user): self
    {
        return new self(
            $user->getId(),
            $user->getEmail(),
            $user->getFirstName(),
            $user->getLastName(),
            $user->getCreatedAt()->format('Y-m-d')
        );
    }
}
