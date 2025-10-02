import random

def gen_base36():
  chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  result = "".join(random.choice(chars) for _ in range(4))
  return result
