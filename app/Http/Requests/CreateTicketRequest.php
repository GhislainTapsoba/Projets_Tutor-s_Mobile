<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTicketRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'service_id' => 'required|exists:services,id',
            'client_phone' => 'nullable|string|max:20',
        ];
    }

    public function messages()
    {
        return [
            'service_id.required' => 'Veuillez sélectionner un service.',
            'service_id.exists' => 'Le service sélectionné n\'existe pas.',
            'client_phone.max' => 'Le numéro de téléphone ne peut pas dépasser 20 caractères.',
        ];
    }
}
