<?php

namespace App\Exception;

use RuntimeException;

final class ValidationException extends RuntimeException
{
    public function __construct(
        private readonly array $errors,
        private readonly int $statusCode = 422,
        string $message = 'Erreur de validation des données'
    ) {
        // Transmet le message ET le code HTTP au constructeur parent
        parent::__construct($message, $statusCode);
    }

    public function getErrors(): array 
    { 
        return $this->errors; 
    }

    public function getStatusCode(): int 
    { 
        return $this->statusCode; 
    }
}