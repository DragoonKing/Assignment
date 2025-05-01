import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertDoctorSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Extend the insert schema with more validations
const formSchema = insertDoctorSchema.extend({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  specialty: z.string().min(1, { message: "Specialty is required" }),
  qualifications: z.string().min(5, { message: "Qualifications are required" }),
  experience: z.number().min(0, { message: "Experience must be a positive number" }),
  fees: z.number().min(100, { message: "Fees must be at least ₹100" }),
  imageUrl: z.string().url({ message: "Image URL must be valid" }).optional().or(z.literal('')),
  languages: z.array(z.string()).min(1, { message: "At least one language is required" }),
  consultationModes: z.array(z.enum(["video", "hospital", "home"])).min(1, { message: "At least one consultation mode is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddDoctorPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [, setLocation] = useLocation();

  // Get specialties from API
  const { data: specialties = [] } = useQuery({
    queryKey: ['/api/specialties'],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      specialty: "",
      qualifications: "",
      experience: 0,
      fees: 500,
      imageUrl: "",
      languages: ["English"],
      isVerified: true,
      availableToday: false,
      availableOnWeekend: false,
      consultationModes: ["video"],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/doctors", data);
      
      // Show success toast and reset form
      toast({
        title: "Doctor added successfully",
        description: "The doctor has been added to the system.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      setIsSuccess(true);
      
      // Redirect to doctors list after 2 seconds
      setTimeout(() => {
        setLocation("/doctors");
      }, 2000);
      
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        title: "Error adding doctor",
        description: "There was an error adding the doctor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Bengali", label: "Bengali" },
    { value: "Marathi", label: "Marathi" },
    { value: "Tamil", label: "Tamil" },
    { value: "Telugu", label: "Telugu" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Kannada", label: "Kannada" },
  ];

  const consultationModeOptions = [
    { value: "video", label: "Video Consultation" },
    { value: "hospital", label: "Hospital Visit" },
    { value: "home", label: "Home Visit" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-apollo-gray-900">Add New Doctor</h1>
        <p className="mt-1 text-apollo-gray-600">Enter doctor details to add them to the system</p>
      </div>

      {isSuccess ? (
        <Alert className="mb-8 bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-800">Doctor Added Successfully</AlertTitle>
          <AlertDescription className="text-green-700">
            The doctor has been added to the system. Redirecting to doctors list...
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
          <CardDescription>
            Fill in the details below to add a new doctor to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <Separator />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender*</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="other" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Other</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialties.map((specialty: any) => (
                            <SelectItem key={specialty.id} value={specialty.name}>
                              {specialty.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/doctor-image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a public URL to the doctor's profile image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Professional Info Section */}
                <div className="space-y-4 md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium">Professional Information</h3>
                  <Separator />
                </div>

                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualifications*</FormLabel>
                      <FormControl>
                        <Input placeholder="MBBS, MD, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (years)*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Fees (₹)*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="100" 
                          step="100" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languages"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Languages*</FormLabel>
                        <FormDescription>
                          Select languages the doctor speaks
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {languageOptions.map((language) => (
                          <FormField
                            key={language.value}
                            control={form.control}
                            name="languages"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={language.value}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(language.value)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, language.value])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== language.value
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {language.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Practice Info Section */}
                <div className="space-y-4 md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium">Practice Information</h3>
                  <Separator />
                </div>

                <FormField
                  control={form.control}
                  name="consultationModes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Consultation Modes*</FormLabel>
                        <FormDescription>
                          Select available consultation modes
                        </FormDescription>
                      </div>
                      <div className="space-y-2">
                        {consultationModeOptions.map((mode) => (
                          <FormField
                            key={mode.value}
                            control={form.control}
                            name="consultationModes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={mode.value}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(mode.value as any)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, mode.value])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== mode.value
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {mode.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="availableToday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal cursor-pointer">
                            Available Today
                          </FormLabel>
                          <FormDescription>
                            Doctor is available for appointments today
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availableOnWeekend"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal cursor-pointer">
                            Available on Weekends
                          </FormLabel>
                          <FormDescription>
                            Doctor is available for appointments on weekends
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isVerified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal cursor-pointer">
                            Verified Profile
                          </FormLabel>
                          <FormDescription>
                            Doctor's credentials have been verified
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <Button variant="outline" type="button" onClick={() => form.reset()}>
                  Reset
                </Button>
                <Link href="/doctors">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Doctor"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
