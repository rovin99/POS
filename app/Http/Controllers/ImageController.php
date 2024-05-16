<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function addImage(Request $request)
    {
        $transactionId = $request->input('transactionId');

        // Validate the request
        $request->validate([
            'transactionId' => 'required|integer',
            'image' => 'required|image',
        ]);

        // Check if transaction exists
        $transaction = DB::table('transactions')->where('transactionId', $transactionId)->first();

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Transaction not found'], 404);
        }

        $logDate = date('Ymd', strtotime($transaction->logDate));

        // Handle the file upload
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = 'images/' . $imageName;
            $image->move(public_path('images'), $imageName);
            
            $update = DB::table('transactions')
                ->where('transactionId', $transactionId)
                ->update(['imageUrl' => $imagePath]);

            if ($update) {
                return response()->json(['success' => true, 'message' => 'Image uploaded successfully']);
            } else {
                return response()->json(['success' => false, 'message' => 'Failed to update transaction with image'], 500);
            }
        } else {
            return response()->json(['success' => false, 'message' => 'No image uploaded or upload error'], 400);
        }
    }
}
