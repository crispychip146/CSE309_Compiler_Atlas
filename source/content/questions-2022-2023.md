# Examinations 2022-2023

## PDF page 8

**L-3/T-1/CSE**  
**BANGLADESH UNIVERSITY OF ENGINEERING AND TECHNOLOGY, DHAKA**  
**L-3/T-1 B. Sc. Engineering Examinations 2022-2023**  
**Sub: CSE 309 (Compiler)**  
**Printed date: 31/03/2024** (crossed out; handwritten replacement: **13/5/2024**)  
**Full Marks: 210**  
**Time: 3 Hours**

The figures in the margin indicate full marks.  
USE SEPARATE SCRIPTS FOR EACH SECTION

## Section A

There are FOUR questions in this section. Answer to Question no. 1 (one) is Compulsory. Answer any TWO questions from Questions 2-4.

### 1 [COMPULSORY]

**(a)** Appraise the differences between bytecode and machine language. **(3)**

**(b)** The partial contents of a buffer in a lexical analyzer is **(6)**

```text
cse123--++12.45==␣1␣
```

Where `␣` indicates a space. At the current moment, both `lexemeBegin` and `forward` pointers are on c of cse (indicated as position 0). From the perspective of C programming language, write down the positions of the pointers in the table below when this string is scanned. Also, indicate any token identified in the third row. Not all the cells in this row will get populated. There may be more columns than needed in this table.

**Blank answer-table template (first strip):**

| lexemeBegin | | | | | | | | | | | | | | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| forward | | | | | | | | | | | | | | |
| Token | | | | | | | | | | | | | | |

⋮

**Blank answer-table template (second strip):**

| lexemeBegin | | | | | | | | | | | | | | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| forward | | | | | | | | | | | | | | |
| Token | | | | | | | | | | | | | | |

**(c)** Given below are several statements/entity names related to the linker and loader. Determine which of the statements are related to the linker and which of the statements are related to loader. Only the serial numbers will suffice. You can assign a serial number to either the linker or loader, but not to both. **(5)**

(i) Object files.  
(ii) Accountable for loading programs and libraries.  
(iii) Load executable files to memory.  
(iv) Produce executable files.  
(v) Allocate address to executable files.  
(vi) Accountable for managing objects in the program's space.  
(vii) Setting up references that are utilized in the program.

Partial solutions provided below as examples.

**Linker:** i.  
**Loader:** ii.

## PDF page 9

**1(d)** When you carry out left factoring of a grammar, argue carefully that the grammar produced generates the same language as the original grammar. **(6)**

**1(e)** Write a procedure based predictive parser for the following grammar keeping the grammar unaltered: **(5)**

```text
E → E + F | E - F | F
F → NUM | ID(E)
```

Point out any possible flaw of the parser you have constructed.

**1(f)** What will be the general appearances of the LL(0) grammars? Provide relevant examples. Comment on the applicability of these grammars for useful parsing. **(5)**

**1(g)** For a certain context free grammar, there is exactly one production rule for each nonterminal. What kind of parser do you suggest for this grammar keeping optimality in mind? Explain clearly. **(5)**

### 2

**(a)** Why are the universal parsing methods not used in production compilers? **(3)**

**(b)** Elucidate carefully how the SLR(0) parsing table will be different from an SLR(1) parsing table. **(5)**

**(c)** Eliminate left recursion from the grammar: **(10)**

```text
A → Ba | Aa | c
B → Bb | Ab | d
```

**(d)** Explain how the separation of the analysis portion of a compiler into lexical analysis and parsing (syntax analysis) phases, contributes to the adoption of a new language to an already existing compiler. **(5)**

**(e)** For the grammar given below, find the FOLLOW sets of the non-terminals. **(12)**

```text
S → aABe
A → B | ε
B → bB | Cd
C → cC | ε
D → dD | ε
```

### 3

**(a)** In a certain cell of a predictive parsing table, there are two entries of the form `A → α` and `A → ε`. Explain what this means from the context of the FIRST and FOLLOW sets. **(7)**

**(b)** Consider the context free grammar given below: **(10)**

```text
S → Aab | aS | bc
A → aacd | bef
B → bef | ε
```

## PDF page 10

**3(b), continued:** If we consider the above grammar to be LL(k), what will be the value of k? Answer with necessary analysis of each of the productions.

**3(c)** Explain why LL(1) parsing is associated with left-most derivations of parse trees. **(6)**

**3(d)** Show that the grammar below is LL(1) but not SLR(1). **(12)**

```text
S → AaAb | BbBa
A → ε
B → ε
```

### 4

**(a)** Explain how empty production rules (epsilon productions) are handled in procedure based predictive parsers. **(5)**

**(b)** For the grammar `S → SS+ | SS* | a`, identify the handles for parsing the right-sentential form `aaa*a++`. Show your computations. **(10)**

**(c)** We say that a configuration `[A → β1 · β2, a]` is valid for a viable prefix `αβ1` if there is a derivation: **(10)**

$$
S' \overset{*}{\underset{rm}{\Rightarrow}} \alpha A w
\underset{rm}{\Rightarrow} \alpha\beta_1\beta_2 w.
$$

Why?

**(b) [second occurrence in source]** We have an LR(1) grammar. If we formulate an LALR(1) grammar from this, do you think that the resulting union will have a parsing-action conflict? Justify your answer. **(10)**

> **Transcription note:** The fourth subquestion is also labeled `(b)` in the source; this duplicate label has been retained.

## Section B

There are FOUR questions in this section. Answer to Question no. 5 (five) is Compulsory. Answer any TWO questions from Questions 6-8.

(All the symbols have their usual meanings in the context of compilers unless explicitly mentioned)

### 5

**(a)** Consider the three-address code below and answer the following questions. **(10+15)**

(i) Identify the basic blocks and construct the flow graph for the given code. Give each block an identifier and replace the label references in the statements with the corresponding identifiers.

(ii) Optimize the code by discovering all possible semantic preserving transformations. For each of the transformations used, specify the name of the transformation.

```text
 1  L1:  i = 0
 2  L3:  t1 = n - 1
 3       iffalse i < t1 goto L2
 4  L4:  j = i + 1
 5  L5:  iffalse j < n goto L6
 6  L7:  t2 = i * 8
 7       t3 = a[t2]
 8       t4 = j * 8
 9       t5 = a[t4]
10       iffalse t3 > t5 goto L8
11  L9:  t6 = i * 8
12       p = a[t6]
13  L10: t7 = i * 8
14       t8 = j * 8
15       t9 = a[t8]
16       a[t7] = t9
17  L11: t10 = j * 8
18       a[t10] = p
19  L8:  j = j + 1
20       goto L5
21  L6:  i = i + 1
22       goto L3
23  L2:
```

## PDF page 11

**5(b)** Consider a 'C' code fragment and the corresponding assembly code generated by some 'gcc' compiler using `-O2` optimization switch. Now, identify and explain the optimizations that have been performed by the compiler for the given 'C' code. **(10)**

**Program written in C**

```c
#include<stdio.h>
int a[50], b[50], x, y, z, k, n;
int factorial(int n)
{
    int fact;
    for (int i=n; i>=0; i--)
        fact = fact * i;
    return fact;
}
int main() {
    int t;
    t = y;
    y = z;
    z = t;

    x = y ^ y;
    if (x) n = 10;
    else n = 20;
    k = factorial(n);

    for (int j=0; j<50; j++)
        for (int i=0; i<100; i++)
            a[j] *= b[j];
    return 0;
    for (int i=0; i<50; i++)
        a[i] = b[i];
}
```

**Assembly code generated by gcc**

```asm
factorial(int):
    xor eax, eax
    ret
main:
    mov eax, DWORD PTR y[rip]
    mov edx, DWORD PTR z[rip]
    xor esi, esi
    mov DWORD PTR x[rip], 0
    mov DWORD PTR n[rip], 20
    mov DWORD PTR y[rip], edx
    mov DWORD PTR z[rip], eax
    mov DWORD PTR k[rip], 0
.L4:
    mov eax, DWORD PTR a[rsi]
    mov ecx, DWORD PTR b[rsi]
    mov edx, 100
.L5:
    imul eax, ecx
    imul eax, ecx
    sub edx, 2
    jne .L5
    mov DWORD PTR a[rsi], eax
    add rsi, 4
    cmp rsi, 200
    jne .L4
    xor eax, eax
    ret
```

### 6

**(a)** Below is a grammar for simple expressions involving only numbers and the operators '+' and '*', such as `2*(3+4)*5`. Write a postfix Syntax-Directed Translation Scheme (SDT) to compute the DAG (Directed Acyclic Graph) for an expression represented by the given grammar. Explain how your SDT would detect common subexpressions. **(12)**

```text
E → E + T
E → T
T → T * F
T → F
F → (E)
F → id
F → num
```

## PDF page 12

**6(b)** Consider the following E-productions from an SDT for translating infix expressions to postfix notation. Transform the SDT such that it can be implemented during top-down parsing. Show the correctness of your SDT by computing the output for the expression `2+3+4`. **(5+4)**

```text
E → E1 + T {print('+');}
E → T
```

**6(c)** What is the use of a φ-function in SSA (Static Single-Assignment) form. Explain with a suitable example. **(8)**

**6(d)** Write the three-address code for the statement **(6)**

```text
x = a[b[c[j]]
```

Assume that- (i) the arrays a, b and c are declared as, `int a[5], b[3], c[3];` types and widths of the arrays have correctly been saved in the symbol table, (ii) i and x are integers, and (iii) the size of an integer is 2 byte.

> **Transcription note:** The source prints only two closing `]` characters in the statement, and mentions `i` in the assumptions while the index in the statement is `j`. Both are retained.

### 7

**(a)** Give an outline of syntax-directed translations of switch-statements of the following form. Accordingly, show the three-address translation of a switch-statement. Briefly discuss how the n-way branch in a switch-statement can be evaluated. **(10+5)**

```text
switch (E) {
    case V1: S1
    case V2: S2
        ...
    case V(n-1): S(n-1)
    default: Sn
}
```

**(b)** Write down the three-address code for the statement below avoiding redundant gotos. Assume `&&`, `||` are left associative and precedence order is `&&` then `||`. **(5)**

```c
if (x > 20 && (x < 10 || x != y))
    x = 0;
else x = 1;
```

**(c)** Illustrate, using an example scenario, the difference between basic mark-and-compact and Cheney's copying collector algorithms for garbage collection. Specify the running-times of both the algorithms. **(12+3)**

## PDF page 13

### 8

**(a)** Consider that the following code computes the binomial coefficient recursively. **(10)**

```cpp
int binCoeff(int n, int r)
{
    if (r == 0 || r == n) //base cases
        return 1;

    return binCoeff(n - 1, r - 1) + binCoeff(n - 1, r);
}

int main()
{
    cout << binCoeff(5, 3);
    return 0;
}
```

Now, answer the questions below.

(i) Show the complete activation tree for it.

(ii) What is the maximum number of activation records that will reside in the stack during execution of the program? Explain your answer using your activation tree.

(iii) What does the control stack and its activation records look like when the base cases is satisfied for the first time and the function is about to return. Show only the arguments in an activation record.

**(b)** Determine the liveliness and next-use information for each statement in the basic block below. Assume t, u and v are temporary variables and the remaining variables are live on exit from the block. **(8)**

```text
t = a - c
u = d - b
t = a + b
a = u + t
d = t + v
```

**(c)** Illustrate the 'linear scan' register allocation algorithm using the following three-address code as an example. Assume three physical registers are available. Make any other justified assumptions as required. What is the advantage of this algorithm? **(15+2)**

```text
 1      a = b + c
 2      d = d - b
 3      e = a + f
 4      ifFalse e goto L1
 5      f = a - d
 6      goto L2
 7  L1:
 8      b = d + f
 9      e = a - c
10  L2:
11      b = d + c
```

---

