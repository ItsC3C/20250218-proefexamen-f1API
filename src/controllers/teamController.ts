import { Request, Response } from "express";
import { Team } from "../models/teamModel";
import { Driver } from "../models/driverModel";

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find().lean();
    if (!teams.length) {
      res.status(404).json({ message: "No teams found" });
      return;
    }

    // Check if time formatting is requested via query
    const formatTimes = req.query.format === "true";

    // Extract unique driver IDs correctly
    const driverIds = Array.from(
      new Set(
        teams.flatMap((team) =>
          team.drivers.map((driver: { driver_id: string }) => driver.driver_id)
        )
      )
    );

    // Fetch drivers
    const drivers = await Driver.find({ driver_id: { $in: driverIds } }).lean();

    // Add flag URLs to drivers
    const driversWithFlags = drivers.map((driver) => ({
      ...driver, // Keep existing properties
      country_flag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${driver.countryCode}.svg`,
    }));

    // Create driver lookup map with flags included
    const driverMap = new Map<string, (typeof driversWithFlags)[number]>();
    driversWithFlags.forEach((driver) =>
      driverMap.set(driver.driver_id, driver)
    );

    // Merge driver details into team data
    const teamsWithDriverDetails = teams.map((team) => ({
      ...team,
      drivers: team.drivers.map(
        (driver: { driver_id: string }) =>
          driverMap.get(driver.driver_id) || null
      ),
    }));

    res.status(200).json({ status: "success", data: teamsWithDriverDetails });
  } catch (error: unknown) {
    console.error("Error fetching teams:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// Create a team
export const createTeam = async (req: Request, res: Response) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json({ status: "success", data: team });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
