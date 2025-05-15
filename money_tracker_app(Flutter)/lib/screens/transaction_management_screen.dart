import 'package:flutter/material.dart';
import '../services/firestore_service.dart';
import '../models/transaction_model.dart';
import 'add_transaction_screen.dart';
import 'edit_transaction_screen.dart';

class TransactionManagementScreen extends StatefulWidget {
  const TransactionManagementScreen({Key? key}) : super(key: key);

  @override
  _TransactionManagementScreenState createState() =>
      _TransactionManagementScreenState();
}

class _TransactionManagementScreenState
    extends State<TransactionManagementScreen> {
  final FirestoreService _firestoreService = FirestoreService();
  String _sortOption = 'Date';
  String _searchQuery = '';
  bool _isSearching = false;

  void _startSearch() {
    setState(() {
      _isSearching = true;
    });
  }

  void _stopSearch() {
    setState(() {
      _isSearching = false;
      _searchQuery = '';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _isSearching
            ? TextField(
                autofocus: true,
                decoration: const InputDecoration(hintText: 'Search...'),
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value;
                  });
                },
              )
            : const Text('Transactions'),
        actions: [
          if (!_isSearching)
            IconButton(
              icon: const Icon(Icons.search),
              onPressed: _startSearch,
            ),
          if (_isSearching)
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: _stopSearch,
            ),
          PopupMenuButton<String>(
            onSelected: (value) {
              setState(() {
                _sortOption = value;
              });
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'Date',
                child: Text('Sort by Date'),
              ),
              const PopupMenuItem(
                value: 'Amount',
                child: Text('Sort by Amount'),
              ),
            ],
          ),
        ],
      ),
      body: StreamBuilder<List<TransactionModel>>(
        stream: _firestoreService.getTransactions(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return const Center(child: Text('Error loading transactions.'));
          }

          List<TransactionModel> transactions = snapshot.data ?? [];
          transactions = _applySortingAndFiltering(transactions);

          if (transactions.isEmpty) {
            return const Center(child: Text('No transactions found.'));
          }

          return ListView.builder(
            itemCount: transactions.length,
            itemBuilder: (context, index) {
              final transaction = transactions[index];
              return ListTile(
                leading: Icon(
                  transaction.category == 'Income'
                      ? Icons.arrow_downward
                      : Icons.arrow_upward,
                  color: transaction.category == 'Income'
                      ? Colors.green
                      : Colors.red,
                ),
                title: Text(transaction.label),
                subtitle: Text(
                    '${transaction.formattedDate} - ${transaction.description}'),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      transaction.isPaid
                          ? Icons.check_circle
                          : Icons.cancel,
                      color: transaction.isPaid ? Colors.green : Colors.red,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      transaction.category == 'Income'
                          ? '+\$${transaction.amount.toStringAsFixed(2)}'
                          : '-\$${transaction.amount.toStringAsFixed(2)}',
                      style: TextStyle(
                        color: transaction.category == 'Income'
                            ? Colors.green
                            : Colors.red,
                      ),
                    ),
                  ],
                ),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => EditTransactionScreen(
                        transaction: transaction,
                      ),
                    ),
                  );
                },
                onLongPress: () => _confirmDeleteTransaction(transaction),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddTransactionScreen()),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  List<TransactionModel> _applySortingAndFiltering(
      List<TransactionModel> transactions) {
    if (_searchQuery.isNotEmpty) {
      transactions = transactions
          .where((transaction) =>
              transaction.label.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList();
    }

    if (_sortOption == 'Amount') {
      transactions.sort((a, b) => b.amount.compareTo(a.amount));
    } else {
      transactions.sort((a, b) => b.date.compareTo(a.date));
    }

    return transactions;
  }

  void _confirmDeleteTransaction(TransactionModel transaction) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Delete Transaction'),
          content: const Text(
              'Are you sure you want to delete this transaction? This action cannot be undone.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _firestoreService.deleteTransaction(transaction.id);
              },
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }
}
