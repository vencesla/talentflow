<?php

namespace App\EventSubscriber;

use App\Exception\ValidationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => 'onKernelException',
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        // On n'intercepte que nos ValidationException
        if (!$exception instanceof ValidationException) {
            return;
        }

        // On formate la réponse JSON propre pour le front-end
        $response = new JsonResponse([
            'message' => $exception->getMessage(),
            'errors' => $exception->getErrors(),
        ], $exception->getStatusCode());

        // On définit la réponse pour stopper la propagation
        $event->setResponse($response);
    }
}