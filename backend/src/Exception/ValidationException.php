<?php

namespace App\Exception;

use RuntimeException;

final class ValidationException extends \RuntimeException
{
    public function __construct(
        private readonly array $errors,
        private readonly int $statusCode = 422
    ) {
        parent::__construct('Validation failed');
    }

    public function getErrors(): array { return $this->errors; }
    public function getStatusCode(): int { return $this->statusCode; }
}
