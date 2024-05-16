<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment; // Assuming you have a Comment model
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'userId' => 'nullable|integer',
            'transactionId' => 'nullable|integer',
            'comment' => 'required|string',
            'status' => 'string|default:waiting',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()], 400);
        }

        try {
            $comment = Comment::create($request->all());
            return response()->json(['success' => true, 'message' => 'Comment added successfully', 'comment' => $comment], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error adding comment: ' . $e->getMessage()], 500);
        }
    }

    public function modify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'commentId' => 'required|integer',
            'newStatus' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()], 400);
        }

        try {
            $comment = Comment::find($request->commentId);
            if (!$comment) {
                return response()->json(['success' => false, 'message' => 'Comment not found'], 404);
            }

            $comment->status = $request->newStatus;
            $comment->save();

            return response()->json(['success' => true, 'message' => 'Comment status updated successfully', 'comment' => $comment], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error updating comment status: ' . $e->getMessage()], 500);
        }
    }
    public function index(Request $request)
    {
        $userId = $request->input('userId');

        $query = DB::table('comments')
            ->select('id as commentId', 'user_id as userId', 'transaction_id as transactionId', 'comment', 'status', 'log_date as commentDate')
            ->orderBy('log_date', 'desc');

        if ($userId !== null) {
            $query->where('user_id', $userId);
        }

        try {
            $comments = $query->get();
            return response()->json($comments);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error when fetching comments'], 500);
        }
    }
}
