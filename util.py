import random
import os
from database import Orders

def gen_base36():
  chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  result = "".join(random.choice(chars) for _ in range(4))
  return result

def return_list():
  orders = []
  count = 0
  for i in range(1, int(os.getenv("PLATE_NUM"))):
    order = Orders.query.filter_by(id=i).first()
    order_items = order.items  # 一人の注文の品の詳細取得
    if order.is_provided:  # 注文されてなかったらスキップ
      continue
    orders.append([])
    for j in order_items:  # 注文の詳細たちを処理
      if j.provided or j.deleted:
        continue
      options = [k.name for k in j.options]  # 配列に変換
      orders[count].append({"id": j.id, "ordererId": j.orderer_id, "item": j.product.name, "options": options, "quantity": j.quantity, "price": int(j.price)})
    count += 1
  print(orders)
  return orders
