<?php

namespace App\Http\Controllers;
use App\Models\Bill;
use Illuminate\Http\Request;
use App\Models\Item;
use Carbon\Carbon;
class BillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bills = Bill::all();
        return response()->json($bills);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_number' => 'required|integer',
            'total_amount' => 'required|numeric',
            'sub_total' => 'required|numeric',
            'tax' => 'required|numeric',
            'payment_mode' => 'required|string',
            'cart_items' => 'required|array',
        ]);

        $bill = Bill::create($request->all());
        return response()->json(['message' => 'Bill Created Successfully!', 'bill' => $bill]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getTodaysSales()
    {
        $date = Carbon::now()->toDateString();
        $sales = Bill::whereDate('created_at', $date)->sum('total_amount');
        return response()->json(['sales' => $sales]);
    }

    /**
     * Get this week's sales.
     */
    public function getThisWeeksSales()
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        $sales = Bill::whereBetween('created_at', [$startOfWeek, $endOfWeek])->sum('total_amount');
        return response()->json(['sales' => $sales]);
    }

    /**
     * Get this month's sales.
     */
    public function getThisMonthsSales()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $sales = Bill::whereBetween('created_at', [$startOfMonth, $endOfMonth])->sum('total_amount');
        return response()->json(['sales' => $sales]);
    }

    /**
     * Get most sold items.
     */
    public function getMostSoldItems()
    {
        $items = Item::withCount('bills')->orderBy('bills_count', 'desc')->get();
        return response()->json($items);
    }

    /**
     * Get monthly profit.
     */
    public function getMonthlyProfit()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $totalSales = Bill::whereBetween('created_at', [$startOfMonth, $endOfMonth])->sum('total_amount');
        $totalCost = Item::sum('cost'); // Assuming 'cost' is a column in your Item model representing the cost price of items
        $profit = $totalSales - $totalCost;
        return response()->json(['profit' => $profit]);
    }

    /**
     * Get monthly sales.
     */
    public function getMonthlySales()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $sales = Bill::whereBetween('created_at', [$startOfMonth, $endOfMonth])->sum('total_amount');
        return response()->json(['sales' => $sales]);
    }
}
