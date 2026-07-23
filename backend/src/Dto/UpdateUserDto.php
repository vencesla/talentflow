<?php

namespace App\Dto\User;

use Symfony\Component\Validator\Constraints as Assert;

final class UpdateUserDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public ?string $email = null,

        #[Assert\NotBlank]
        #[Assert\Length(min: 2)]
        public ?string $firstName = null,

        #[Assert\NotBlank]
        #[Assert\Length(min: 2)]
        public ?string $lastName = null,
    ) {}
}
