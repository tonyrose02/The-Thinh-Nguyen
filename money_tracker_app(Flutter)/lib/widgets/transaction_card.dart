import 'package:flutter/material.dart';

class TransactionCard extends StatelessWidget {
  final String title;
  final double amount;
  final String type; // "income" or "expense"
  final List<String> tags;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final VoidCallback onSetReminder;

  const TransactionCard({
    required this.title,
    required this.amount,
    required this.type,
    required this.tags,
    required this.onEdit,
    required this.onDelete,
    required this.onSetReminder,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: ListTile(
        leading: Icon(
          type == 'income' ? Icons.arrow_circle_up : Icons.arrow_circle_down,
          color: type == 'income' ? Colors.green : Colors.red,
        ),
        title: Text(title),
        subtitle: Text(
            '\$${amount.toStringAsFixed(2)} | Tags: ${tags.join(', ')}'),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(icon: const Icon(Icons.alarm), onPressed: onSetReminder),
            IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
            IconButton(icon: const Icon(Icons.delete), onPressed: onDelete),
          ],
        ),
      ),
    );
  }
}
