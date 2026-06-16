export function isNewerSequence(nextSeq: number, currentSeq: number | null) {
  if (currentSeq === null) {
    return true;
  }

  return nextSeq > currentSeq;
}

export function nextSequence(currentSeq: number) {
  return currentSeq + 1;
}

export function compareSequence(leftSeq: number, rightSeq: number) {
  if (leftSeq === rightSeq) {
    return 0;
  }

  return leftSeq > rightSeq ? 1 : -1;
}

export function isStaleSequence(nextSeq: number, currentSeq: number | null) {
  return !isNewerSequence(nextSeq, currentSeq);
}
