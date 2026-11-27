// Badge Forge: terminal achievement card.
// dotnet run --project tools/Badge.cs -- 420
using System;

record Survivor(string Name, int Xp)
{
    public string Rank => Xp switch
    {
        >= 1000 => "CHAOS DEITY",
        >= 500 => "ENTROPY OVERLORD",
        >= 200 => "UX GLADIATOR",
        >= 50 => "BRAVE VISITOR",
        _ => "FRESH MEAT",
    };

    public void Print()
    {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("+------------------------------+");
        Console.WriteLine($"|  RANK: {Rank,-20}|");
        Console.WriteLine($"|  XP:   {Xp,-20}|");
        Console.WriteLine("+------------------------------+");
        Console.ResetColor();
    }
}

class Program
{
    static void Main(string[] args)
    {
        var xp = args.Length > 0 && int.TryParse(args[0], out var n) ? n : 120;
        new Survivor("Anon", xp).Print();
    }
}
