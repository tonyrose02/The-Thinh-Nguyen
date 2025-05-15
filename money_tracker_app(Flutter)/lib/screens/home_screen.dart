import 'package:flutter/material.dart';
import 'package:money_tracker_app/screens/settings_screen.dart';
import 'package:money_tracker_app/screens/transaction_management_screen.dart';
import '../services/firestore_service.dart';
import '../models/transaction_model.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  final FirestoreService _firestoreService = FirestoreService();
  double _totalIncome = 0.0;
  double _totalExpenses = 0.0;

  final List<Widget> _screens = [];

  @override
  void initState() {
    super.initState();
    _screens.addAll([
      HomeOverview(
        firestoreService: _firestoreService,
        onSummaryCalculated: _updateSummary,
      ),
      const TransactionManagementScreen(),
      const SettingsScreen(),
    ]);
  }

  void _updateSummary(double totalIncome, double totalExpenses) {
    setState(() {
      _totalIncome = totalIncome;
      _totalExpenses = totalExpenses;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet),
            label: 'Transactions',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}

class HomeOverview extends StatefulWidget {
  final FirestoreService firestoreService;
  final Function(double totalIncome, double totalExpenses) onSummaryCalculated;

  const HomeOverview({
    Key? key,
    required this.firestoreService,
    required this.onSummaryCalculated,
  }) : super(key: key);

  @override
  _HomeOverviewState createState() => _HomeOverviewState();
}

class _HomeOverviewState extends State<HomeOverview> {
  double _totalIncome = 0.0;
  double _totalExpenses = 0.0;
  List<TransactionModel> _recentTransactions = [];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final transactions = await widget.firestoreService.getAllTransactions();

    double income = 0.0;
    double expenses = 0.0;

    for (var transaction in transactions) {
      if (transaction.category == 'Income') {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    }

    setState(() {
      _totalIncome = income;
      _totalExpenses = expenses;
      _recentTransactions = transactions.take(5).toList();
    });

    widget.onSummaryCalculated(income, expenses);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Overview'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Balance Summary',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Column(
                  children: [
                    const Text('Income'),
                    Text(
                      '\$${_totalIncome.toStringAsFixed(2)}',
                      style: const TextStyle(color: Colors.green),
                    ),
                  ],
                ),
                Column(
                  children: [
                    const Text('Expenses'),
                    Text(
                      '\$${_totalExpenses.toStringAsFixed(2)}',
                      style: const TextStyle(color: Colors.red),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 40),
            const Text('Recent Transactions',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Expanded(
              child: ListView.builder(
                itemCount: _recentTransactions.length,
                itemBuilder: (context, index) {
                  final transaction = _recentTransactions[index];
                  return ListTile(
                    title: Text(transaction.label),
                    subtitle: Text(
                        '${transaction.formattedDate} - ${transaction.description}'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          transaction.isPaid ? Icons.check_circle : Icons.cancel,
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
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
