<?php

namespace App\EventSubscriber;

use App\Exception\ValidationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\KernelEvents;

class ExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 10], // Priorité élevée
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        // 1. Cas spécifique : nos erreurs de validation DTO (422)
        if ($exception instanceof ValidationException) {
            $response = new JsonResponse([
                'message' => $exception->getMessage(),
                'errors'  => $exception->getErrors(),
            ], $exception->getStatusCode());

            $event->setResponse($response);
            return;
        }

        // 2. Cas des exceptions HTTP de Symfony (400, 403, 404, etc.)
        if ($exception instanceof HttpExceptionInterface) {
            $response = new JsonResponse([
                'message' => $exception->getMessage(),
            ], $exception->getStatusCode());

            $event->setResponse($response);
            return;
        }

        // 3. Cas des erreurs 500 ou erreurs non attrapées (pour éviter le crash de sérialisation)
        // En environnement de dev, on affiche le message de l'exception réelle
        $response = new JsonResponse([
            'message' => $exception->getMessage(),
            'class'   => get_class($exception),
            'trace'   => $exception->getFile() . ':' . $exception->getLine(),
        ], 500);

        $event->setResponse($response);
    }
}