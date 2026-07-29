<?php

namespace App\Service\Validation;

use App\Exception\ValidationException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final readonly class DTOValidator
{
    public function __construct(
        private ValidatorInterface $validator
    ) {}

    public function validate(object $dto): void
    {
        $violations = $this->validator->validate($dto);

        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[$violation->getPropertyPath()][] = $violation->getMessage();
            }

            throw new ValidationException($errors, 422);
        }
    }
}