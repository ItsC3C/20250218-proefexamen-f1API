import { Request, Response } from "express";
import { Race } from "../models/raceModel";
import { Driver } from "../models/driverModel";

// Helper function to format times
const formatTime = (milliseconds: number, index: number): string => {
  if (isNaN(milliseconds) || milliseconds < 0) return "N/A";

  const date = new Date(milliseconds);
  const seconds = date.getUTCSeconds();
  const millisecondsFormatted = date
    .getMilliseconds()
    .toString()
    .padStart(3, "0");

  if (index === 0) {
    // Full format for first result (HH:MM:SS.MMM)
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}.${millisecondsFormatted}`;
  } else if (index === 1 || index === 2) {
    // Only SS.MMM for second and third results
    return `${seconds}.${millisecondsFormatted}`;
  } else {
    // Default to SSS.MMM format
    return (milliseconds / 1000).toFixed(3);
  }
};

// Function to get races
export const getRaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const races = await Race.find().lean();
    if (!races.length) {
      res.status(404).json({ message: "No races found" });
      return;
    }

    // Check if time formatting is requested via query
    const formatTimes = req.query.format === "true";

    // Collect all unique driver_ids
    const driverIds = Array.from(
      new Set(
        races.flatMap((race) =>
          race.race_results.map((result) => result.driver_id)
        )
      )
    );

    // Fetch drivers
    const drivers = await Driver.find({ driver_id: { $in: driverIds } }).lean();

    // Create driver lookup map
    const driverMap = new Map<string, (typeof drivers)[number]>();
    drivers.forEach((driver) => driverMap.set(driver.driver_id, driver));

    // Merge driver details and conditionally format times
    const racesWithDriverDetails = races.map((race) => ({
      ...race,
      race_results: race.race_results.map((result, index) => ({
        ...result,
        driver: driverMap.get(result.driver_id) || null,
        race_time: formatTimes ? formatTime(result.time, index) : result.time,
      })),
    }));

    res.status(200).json(racesWithDriverDetails);
  } catch (error: unknown) {
    console.error("Error fetching races:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
