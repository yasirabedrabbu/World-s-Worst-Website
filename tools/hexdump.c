/* Hex Curator: portable C99 byte viewer.
 * gcc -O2 tools/hexdump.c -o hexdump && ./hexdump README.md
 */
#include <ctype.h>
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "usage: hexdump FILE\n");
        return 1;
    }
    FILE *f = fopen(argv[1], "rb");
    if (!f) {
        perror("hexdump");
        return 1;
    }

    unsigned char buf[16];
    long offset = 0;
    size_t n;
    while ((n = fread(buf, 1, sizeof buf, f)) > 0) {
        printf("%08lx  ", offset);
        for (size_t i = 0; i < 16; i++) {
            if (i < n) printf("%02x ", buf[i]);
            else printf("   ");
        }
        printf(" |");
        for (size_t i = 0; i < n; i++) putchar(isprint(buf[i]) ? buf[i] : '.');
        printf("|\n");
        offset += (long)n;
    }
    fclose(f);
    return 0;
}
