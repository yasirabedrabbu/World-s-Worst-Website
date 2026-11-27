import java.nio.charset.StandardCharsets;

/** ByteForge: text <-> UTF-8 binary. javac tools/ByteForge.java && java ByteForge "chaos" */
public final class ByteForge {
    private static String toBits(String text) {
        StringBuilder out = new StringBuilder();
        for (byte b : text.getBytes(StandardCharsets.UTF_8)) {
            out.append(String.format("%8s", Integer.toBinaryString(b & 0xFF)).replace(' ', '0')).append(' ');
        }
        return out.toString().trim();
    }

    private static String fromBits(String bits) {
        String[] parts = bits.trim().split("\\s+");
        byte[] bytes = new byte[parts.length];
        for (int i = 0; i < parts.length; i++) {
            bytes[i] = (byte) Integer.parseInt(parts[i], 2);
        }
        return new String(bytes, StandardCharsets.UTF_8);
    }

    public static void main(String[] args) {
        String text = args.length > 0 ? String.join(" ", args) : "chaos";
        String bits = toBits(text);
        System.out.println(text + " -> " + bits);
        System.out.println("round-trip -> " + fromBits(bits));
    }
}
